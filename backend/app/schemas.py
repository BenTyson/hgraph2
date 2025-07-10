from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
import uuid

class BiocharBatchCreate(BaseModel):
    name: str = Field(..., max_length=50)
    date_created: date
    oven: Optional[str] = None
    operator: Optional[str] = None
    temperature: Optional[float] = None
    time_hours: Optional[float] = None
    pressure_bar: Optional[float] = None
    koh_ratio: Optional[float] = None
    water_percent: Optional[float] = None
    input_weight: Optional[float] = None
    output_weight: Optional[float] = None
    yield_percent: Optional[float] = None
    is_milestone: bool = False
    quality_notes: Optional[str] = None

class BiocharBatchResponse(BiocharBatchCreate):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class GrapheneBatchCreate(BaseModel):
    name: str = Field(..., max_length=50)
    date_created: date
    oven: Optional[str] = None
    operator: Optional[str] = None
    parent_biochar_ids: Optional[List[str]] = None
    is_pooled: bool = False
    temperature: Optional[float] = None
    time_hours: Optional[float] = None
    grinding_method: Optional[str] = None
    gas_type: Optional[str] = None
    koh_ratio: Optional[float] = None
    species: Optional[int] = None
    appearance: Optional[str] = None
    shipped_to: Optional[str] = None
    shipped_date: Optional[date] = None
    shipped_weight: Optional[float] = None
    shipment_notes: Optional[str] = None
    is_oven_c_era: bool = False
    quality_notes: Optional[str] = None

class GrapheneBatchResponse(GrapheneBatchCreate):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime]
    analysis_count: int = 0
    best_bet: Optional[float] = None
    best_conductivity: Optional[float] = None
    
    class Config:
        from_attributes = True

class AnalysisResultCreate(BaseModel):
    graphene_batch_id: uuid.UUID
    date_analyzed: date
    bet_surface_area: Optional[float] = None
    bet_langmuir: Optional[float] = None
    conductivity: Optional[float] = None
    conductivity_unit: str = "S/m"
    capacitance: Optional[float] = None
    pore_size: Optional[float] = None
    analysis_method: Optional[str] = None
    instrument: Optional[str] = None
    analyst: Optional[str] = None
    sem_images: Optional[List[str]] = None
    tem_images: Optional[List[str]] = None
    reports: Optional[List[str]] = None
    comments: Optional[str] = None

class AnalysisResultResponse(AnalysisResultCreate):
    id: uuid.UUID
    created_at: datetime
    energy_storage_grade: Optional[str] = None  # calculated field
    
    class Config:
        from_attributes = True
