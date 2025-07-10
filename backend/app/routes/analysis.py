from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import AnalysisResult, GrapheneBatch, BET_TARGETS
from app.schemas import AnalysisResultCreate, AnalysisResultResponse
import shutil
import os
from uuid import uuid4

router = APIRouter()

@router.post("/", response_model=AnalysisResultResponse)
async def create_analysis_result(
    analysis: AnalysisResultCreate, 
    db: Session = Depends(get_db)
):
    """Create a new analysis result for a graphene batch"""
    
    # Verify the graphene batch exists
    batch = db.query(GrapheneBatch).filter(GrapheneBatch.id == analysis.graphene_batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Graphene batch not found")
    
    db_analysis = AnalysisResult(**analysis.dict())
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    
    # Add energy storage grade calculation
    db_analysis.energy_storage_grade = _calculate_energy_grade(db_analysis.bet_surface_area)
    
    return db_analysis

@router.get("/batch/{batch_id}", response_model=List[AnalysisResultResponse])
async def get_batch_analysis(batch_id: str, db: Session = Depends(get_db)):
    """Get all analysis results for a specific graphene batch"""
    results = db.query(AnalysisResult).filter(
        AnalysisResult.graphene_batch_id == batch_id
    ).order_by(AnalysisResult.date_analyzed.desc()).all()
    
    # Add energy storage grades
    for result in results:
        result.energy_storage_grade = _calculate_energy_grade(result.bet_surface_area)
    
    return results

@router.post("/upload-images/{analysis_id}")
async def upload_analysis_images(
    analysis_id: str,
    sem_files: List[UploadFile] = File([]),
    tem_files: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    """Upload SEM/TEM images for an analysis result"""
    
    analysis = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis result not found")
    
    sem_paths = []
    tem_paths = []
    
    # Save SEM images
    for file in sem_files:
        if file.filename:
            file_id = str(uuid4())
            file_path = f"uploads/sem_images/{file_id}_{file.filename}"
            os.makedirs("uploads/sem_images", exist_ok=True)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            sem_paths.append(file_path)
    
    # Save TEM images
    for file in tem_files:
        if file.filename:
            file_id = str(uuid4())
            file_path = f"uploads/tem_images/{file_id}_{file.filename}"
            os.makedirs("uploads/tem_images", exist_ok=True)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            tem_paths.append(file_path)
    
    # Update analysis with file paths
    if sem_paths:
        analysis.sem_images = (analysis.sem_images or []) + sem_paths
    if tem_paths:
        analysis.tem_images = (analysis.tem_images or []) + tem_paths
    
    db.commit()
    
    return {
        "message": "Images uploaded successfully",
        "sem_count": len(sem_paths),
        "tem_count": len(tem_paths)
    }

def _calculate_energy_grade(bet_value: Optional[float]) -> Optional[str]:
    """Calculate energy storage application grade based on BET surface area"""
    if not bet_value:
        return None
    
    # Use supercapacitor targets as primary grade
    targets = BET_TARGETS["supercapacitor"]
    
    if bet_value >= targets["excellent"]:
        return "Excellent"
    elif bet_value >= targets["good"]:
        return "Good"
    elif bet_value >= targets["acceptable"]:
        return "Acceptable"
    else:
        return "Poor"
