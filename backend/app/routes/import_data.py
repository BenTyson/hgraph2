from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import BiocharBatch, GrapheneBatch, AnalysisResult
import pandas as pd
import io
from datetime import datetime, date
from typing import Dict, Any
import json

router = APIRouter()

@router.post("/csv")
async def import_csv_data(
    file: UploadFile = File(...),
    data_type: str = "graphene",  # "biochar", "graphene", or "analysis"
    db: Session = Depends(get_db)
):
    """Import batch data from CSV file matching Curia report format"""
    
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="File must be CSV or Excel format")
    
    try:
        # Read file content
        content = await file.read()
        
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        imported_count = 0
        errors = []
        
        if data_type == "graphene":
            imported_count, errors = await _import_graphene_batches(df, db)
        elif data_type == "biochar":
            imported_count, errors = await _import_biochar_batches(df, db)
        elif data_type == "analysis":
            imported_count, errors = await _import_analysis_results(df, db)
        else:
            raise HTTPException(status_code=400, detail="Invalid data_type")
        
        return {
            "message": f"Import completed",
            "imported_count": imported_count,
            "errors": errors,
            "total_rows": len(df)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

async def _import_graphene_batches(df: pd.DataFrame, db: Session) -> tuple[int, list]:
    """Import graphene batch data from DataFrame"""
    imported_count = 0
    errors = []
    
    # Expected columns for graphene batches (based on Curia report)
    column_mapping = {
        'Experiment': 'name',
        'Oven': 'oven', 
        'Lot': 'parent_biochar_name',  # We'll need to resolve to IDs
        'T (rate)': 'temperature',
        't': 'time_hours',
        'Species': 'species',
        'Appearance': 'appearance',
        'Output': 'output_weight'
    }
    
    for index, row in df.iterrows():
        try:
            # Extract data based on column mapping
            batch_data = {}
            
            # Required fields
            if 'Experiment' in row and pd.notna(row['Experiment']):
                batch_data['name'] = str(row['Experiment']).strip()
            else:
                errors.append(f"Row {index}: Missing experiment name")
                continue
            
            # Set default date to today if not provided
            batch_data['date_created'] = date.today()
            
            # Map other fields
            for csv_col, model_field in column_mapping.items():
                if csv_col in row and pd.notna(row[csv_col]):
                    value = row[csv_col]
                    
                    if model_field in ['temperature', 'time_hours', 'output_weight']:
                        # Convert to float, handle units
                        if isinstance(value, str):
                            # Remove units and convert
                            value = ''.join(c for c in value if c.isdigit() or c in '.-')
                            try:
                                value = float(value) if value else None
                            except:
                                value = None
                        batch_data[model_field] = value
                    elif model_field == 'species':
                        # Extract species number
                        if 'Species' in str(value):
                            batch_data[model_field] = 1 if '1' in str(value) else 2
                    else:
                        batch_data[model_field] = str(value).strip()
            
            # Set Oven C era flag
            batch_data['is_oven_c_era'] = batch_data.get('oven') == 'C'
            
            # Create batch
            db_batch = GrapheneBatch(**batch_data)
            db.add(db_batch)
            db.commit()
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Row {index}: {str(e)}")
            db.rollback()
    
    return imported_count, errors

async def _import_biochar_batches(df: pd.DataFrame, db: Session) -> tuple[int, list]:
    """Import biochar batch data from DataFrame"""
    imported_count = 0
    errors = []
    
    # Expected columns for biochar batches
    column_mapping = {
        'Experiment': 'name',
        'Reactor': 'oven',
        'T': 'temperature', 
        't': 'time_hours',
        'Output': 'output_weight',
        'Raw material': 'input_weight'
    }
    
    for index, row in df.iterrows():
        try:
            batch_data = {}
            
            # Required fields
            if 'Experiment' in row and pd.notna(row['Experiment']):
                batch_data['name'] = str(row['Experiment']).strip()
            else:
                errors.append(f"Row {index}: Missing experiment name")
                continue
                
            batch_data['date_created'] = date.today()
            
            # Map fields with unit handling
            for csv_col, model_field in column_mapping.items():
                if csv_col in row and pd.notna(row[csv_col]):
                    value = row[csv_col]
                    
                    if model_field in ['temperature', 'time_hours', 'input_weight', 'output_weight']:
                        # Parse numeric values
                        if isinstance(value, str):
                            value = ''.join(c for c in value if c.isdigit() or c in '.-')
                            try:
                                value = float(value) if value else None
                            except:
                                value = None
                        batch_data[model_field] = value
                    else:
                        batch_data[model_field] = str(value).strip()
            
            # Calculate yield
            if batch_data.get('input_weight') and batch_data.get('output_weight'):
                batch_data['yield_percent'] = (batch_data['output_weight'] / batch_data['input_weight']) * 100
            
            db_batch = BiocharBatch(**batch_data)
            db.add(db_batch)
            db.commit()
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Row {index}: {str(e)}")
            db.rollback()
    
    return imported_count, errors

async def _import_analysis_results(df: pd.DataFrame, db: Session) -> tuple[int, list]:
    """Import analysis results (BET, conductivity) from DataFrame"""
    imported_count = 0
    errors = []
    
    column_mapping = {
        'Sample': 'batch_name',
        'Multipoint BET Area [m^2/g]': 'bet_surface_area',
        'Langmuir Surface Area [m^2/g]': 'bet_langmuir',
        'Conductivity (S/cm)': 'conductivity'
    }
    
    for index, row in df.iterrows():
        try:
            # Find the graphene batch
            batch_name = row.get('Sample') or row.get('Material')
            if not batch_name:
                errors.append(f"Row {index}: No batch name found")
                continue
                
            batch = db.query(GrapheneBatch).filter(
                GrapheneBatch.name == str(batch_name).strip()
            ).first()
            
            if not batch:
                errors.append(f"Row {index}: Batch {batch_name} not found")
                continue
            
            analysis_data = {
                'graphene_batch_id': batch.id,
                'date_analyzed': date.today()
            }
            
            # Map measurement fields
            for csv_col, model_field in column_mapping.items():
                if csv_col in row and pd.notna(row[csv_col]):
                    value = row[csv_col]
                    if isinstance(value, (int, float)):
                        analysis_data[model_field] = float(value)
            
            # Handle conductivity unit conversion (S/cm to S/m)
            if 'conductivity' in analysis_data:
                analysis_data['conductivity'] = analysis_data['conductivity'] * 100  # S/cm to S/m
                analysis_data['conductivity_unit'] = 'S/m'
            
            db_analysis = AnalysisResult(**analysis_data)
            db.add(db_analysis)
            db.commit()
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Row {index}: {str(e)}")
            db.rollback()
    
    return imported_count, errors

@router.get("/template/{data_type}")
async def download_import_template(data_type: str):
    """Download CSV template for data import"""
    
    templates = {
        "graphene": {
            "Experiment": ["MRa445", "MRa440", "TB1175B"],
            "Oven": ["C", "C", "C"], 
            "Species": ["Species 1", "Species 1", "Species 1"],
            "T (rate)": ["800°C", "800°C", "800°C"],
            "t": ["1h", "1h", "1h"],
            "Output": ["14.2g", "23.3g", "739g"],
            "Appearance": ["black/grey brittle", "black/grey brittle", "black/grey brittle"]
        },
        "biochar": {
            "Experiment": ["MB3047", "MB3042", "MB3039"],
            "Reactor": ["AV5", "AV5", "AV5"],
            "T": ["180°C", "180°C", "180°C"],
            "t": ["24h", "24h", "24h"],
            "Raw material": ["80g", "80g", "80g"],
            "Output": ["22.7g", "20.2g", "19.1g"]
        },
        "analysis": {
            "Sample": ["MRa445", "MRa440", "TB1175B"],
            "Multipoint BET Area [m^2/g]": [1650, 1625, 1839],
            "Langmuir Surface Area [m^2/g]": [1677, 1650, 1850],
            "Conductivity (S/cm)": [0.137, 0.137, 0.134]
        }
    }
    
    if data_type not in templates:
        raise HTTPException(status_code=400, detail="Invalid template type")
    
    return {
        "template": templates[data_type],
        "filename": f"hgraph2_{data_type}_template.csv"
    }
