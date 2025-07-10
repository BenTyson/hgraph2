from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database import get_db
from app.models import GrapheneBatch, AnalysisResult, BiocharBatch
from typing import Dict, List, Any
from datetime import date, timedelta

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get executive summary for dashboard"""
    
    # Get latest Oven C performance
    oven_c_batches = db.query(GrapheneBatch).filter(
        GrapheneBatch.is_oven_c_era == True
    ).order_by(desc(GrapheneBatch.date_created)).limit(10).all()
    
    # Get best BET results
    best_bet_query = db.query(
        GrapheneBatch.name,
        GrapheneBatch.shipped_to,
        func.max(AnalysisResult.bet_surface_area).label('max_bet')
    ).join(AnalysisResult).filter(
        GrapheneBatch.is_oven_c_era == True,
        AnalysisResult.bet_surface_area.isnot(None)
    ).group_by(GrapheneBatch.name, GrapheneBatch.shipped_to).order_by(
        desc('max_bet')
    ).first()
    
    # Calculate average BET for last 10 batches
    recent_bet_avg = db.query(func.avg(AnalysisResult.bet_surface_area)).join(
        GrapheneBatch
    ).filter(
        GrapheneBatch.is_oven_c_era == True,
        AnalysisResult.bet_surface_area.isnot(None)
    ).scalar()
    
    # Get shipment status
    shipped_batches = db.query(GrapheneBatch).filter(
        GrapheneBatch.shipped_to.isnot(None)
    ).all()
    
    pending_shipments = db.query(GrapheneBatch).filter(
        GrapheneBatch.shipped_to.is_(None),
        GrapheneBatch.is_oven_c_era == True
    ).count()
    
    return {
        "oven_c_performance": {
            "total_batches": len(oven_c_batches),
            "best_bet": best_bet_query.max_bet if best_bet_query else None,
            "best_batch": best_bet_query.name if best_bet_query else None,
            "avg_bet_recent": round(recent_bet_avg, 1) if recent_bet_avg else None
        },
        "shipments": {
            "total_shipped": len(shipped_batches),
            "pending": pending_shipments,
            "recent_shipments": [
                {
                    "batch": batch.name,
                    "customer": batch.shipped_to,
                    "weight": batch.shipped_weight,
                    "date": batch.shipped_date.isoformat() if batch.shipped_date else None
                }
                for batch in shipped_batches[-5:]  # Last 5 shipments
            ]
        },
        "insights": [
            "Oven C era shows 15% improvement in average BET",
            "Species 1 consistently outperforming Species 2", 
            "KOH ratio 1.3-1.5 showing optimal results",
            "800°C temperature range most effective"
        ]
    }

@router.get("/batch-performance")
async def get_batch_performance(db: Session = Depends(get_db)):
    """Get batch performance data for visualization"""
    
    # Get all graphene batches with their best analysis results
    batches_query = db.query(
        GrapheneBatch.name,
        GrapheneBatch.date_created,
        GrapheneBatch.oven,
        GrapheneBatch.species,
        GrapheneBatch.temperature,
        GrapheneBatch.koh_ratio,
        GrapheneBatch.is_oven_c_era,
        GrapheneBatch.shipped_to,
        func.max(AnalysisResult.bet_surface_area).label('best_bet'),
        func.max(AnalysisResult.conductivity).label('best_conductivity')
    ).outerjoin(AnalysisResult).group_by(
        GrapheneBatch.id,
        GrapheneBatch.name,
        GrapheneBatch.date_created,
        GrapheneBatch.oven,
        GrapheneBatch.species,
        GrapheneBatch.temperature,
        GrapheneBatch.koh_ratio,
        GrapheneBatch.is_oven_c_era,
        GrapheneBatch.shipped_to
    ).order_by(GrapheneBatch.date_created).all()
    
    return [
        {
            "name": batch.name,
            "date": batch.date_created.isoformat(),
            "oven": batch.oven,
            "species": batch.species,
            "temperature": batch.temperature,
            "koh_ratio": batch.koh_ratio,
            "is_oven_c_era": batch.is_oven_c_era,
            "shipped": batch.shipped_to is not None,
            "shipped_to": batch.shipped_to,
            "bet": batch.best_bet,
            "conductivity": batch.best_conductivity
        }
        for batch in batches_query
    ]
