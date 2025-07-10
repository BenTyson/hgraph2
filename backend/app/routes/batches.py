from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import BiocharBatch, GrapheneBatch
from app.schemas import (
    BiocharBatchCreate, BiocharBatchResponse,
    GrapheneBatchCreate, GrapheneBatchResponse
)
from datetime import date, datetime

router = APIRouter()

# Biochar Batch endpoints
@router.post("/biochar", response_model=BiocharBatchResponse)
async def create_biochar_batch(batch: BiocharBatchCreate, db: Session = Depends(get_db)):
    """Create a new biochar batch (Step 1)"""
    db_batch = BiocharBatch(**batch.dict())
    
    # Auto-calculate yield if both weights provided
    if batch.input_weight and batch.output_weight:
        db_batch.yield_percent = (batch.output_weight / batch.input_weight) * 100
    
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@router.get("/biochar", response_model=List[BiocharBatchResponse])
async def get_biochar_batches(
    skip: int = 0,
    limit: int = 100,
    oven: Optional[str] = None,
    operator: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of biochar batches with optional filtering"""
    query = db.query(BiocharBatch)
    
    if oven:
        query = query.filter(BiocharBatch.oven == oven)
    if operator:
        query = query.filter(BiocharBatch.operator == operator)
    
    return query.offset(skip).limit(limit).all()

@router.get("/biochar/{batch_id}", response_model=BiocharBatchResponse)
async def get_biochar_batch(batch_id: str, db: Session = Depends(get_db)):
    """Get specific biochar batch by ID"""
    batch = db.query(BiocharBatch).filter(BiocharBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Biochar batch not found")
    return batch

# Graphene Batch endpoints
@router.post("/graphene", response_model=GrapheneBatchResponse)
async def create_graphene_batch(batch: GrapheneBatchCreate, db: Session = Depends(get_db)):
    """Create a new graphene batch (Step 2)"""
    batch_data = batch.dict()
    
    # Auto-set Oven C era flag (April 2025 onwards)
    if batch.date_created >= date(2025, 4, 1):
        batch_data['is_oven_c_era'] = True
    
    db_batch = GrapheneBatch(**batch_data)
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@router.get("/graphene", response_model=List[GrapheneBatchResponse])
async def get_graphene_batches(
    skip: int = 0,
    limit: int = 100,
    oven: Optional[str] = None,
    species: Optional[int] = None,
    shipped_only: bool = False,
    oven_c_era: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get list of graphene batches with filtering"""
    query = db.query(GrapheneBatch)
    
    if oven:
        query = query.filter(GrapheneBatch.oven == oven)
    if species:
        query = query.filter(GrapheneBatch.species == species)
    if shipped_only:
        query = query.filter(GrapheneBatch.shipped_to.isnot(None))
    if oven_c_era is not None:
        query = query.filter(GrapheneBatch.is_oven_c_era == oven_c_era)
    
    # Order by date created (newest first)
    query = query.order_by(GrapheneBatch.date_created.desc())
    
    batches = query.offset(skip).limit(limit).all()
    
    # Add analysis summary to each batch
    for batch in batches:
        analysis_results = [r for r in batch.analysis_results]
        batch.analysis_count = len(analysis_results)
        if analysis_results:
            bet_values = [r.bet_surface_area for r in analysis_results if r.bet_surface_area]
            conductivity_values = [r.conductivity for r in analysis_results if r.conductivity]
            batch.best_bet = max(bet_values) if bet_values else None
            batch.best_conductivity = max(conductivity_values) if conductivity_values else None
    
    return batches

@router.get("/graphene/{batch_id}", response_model=GrapheneBatchResponse)
async def get_graphene_batch(batch_id: str, db: Session = Depends(get_db)):
    """Get specific graphene batch with analysis summary"""
    batch = db.query(GrapheneBatch).filter(GrapheneBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Graphene batch not found")
    
    # Add analysis summary
    analysis_results = batch.analysis_results
    batch.analysis_count = len(analysis_results)
    if analysis_results:
        bet_values = [r.bet_surface_area for r in analysis_results if r.bet_surface_area]
        conductivity_values = [r.conductivity for r in analysis_results if r.conductivity]
        batch.best_bet = max(bet_values) if bet_values else None
        batch.best_conductivity = max(conductivity_values) if conductivity_values else None
    
    return batch
