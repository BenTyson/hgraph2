from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class BiocharBatch(Base):
    __tablename__ = "biochar_batches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False, index=True)
    date_created = Column(Date, nullable=False)
    oven = Column(String(20))
    operator = Column(String(50))
    
    # Process parameters
    temperature = Column(Float)  # °C
    time_hours = Column(Float)   # hours
    pressure_bar = Column(Float) # bar
    koh_ratio = Column(Float)    # KOH to biochar ratio
    water_percent = Column(Float) # water content %
    
    # Material tracking
    input_weight = Column(Float)  # grams
    output_weight = Column(Float) # grams
    yield_percent = Column(Float) # calculated
    
    # Quality flags
    is_milestone = Column(Boolean, default=False)
    quality_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GrapheneBatch(Base):
    __tablename__ = "graphene_batches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False, index=True)
    date_created = Column(Date, nullable=False)
    oven = Column(String(20))
    operator = Column(String(50))
    
    # Parent relationships
    parent_biochar_ids = Column(JSON)  # array of UUIDs
    is_pooled = Column(Boolean, default=False)
    
    # Process parameters
    temperature = Column(Float)          # °C
    time_hours = Column(Float)           # hours
    grinding_method = Column(String(50)) # mill (1 min), mill (2.5 min), etc.
    gas_type = Column(String(20))        # N2, Ar, etc.
    koh_ratio = Column(Float)            # KOH ratio for this step
    
    # Material classification
    species = Column(Integer)            # 1 or 2
    appearance = Column(Text)            # "black/grey brittle", etc.
    
    # Shipment tracking (VERY IMPORTANT)
    shipped_to = Column(String(100))     # customer/partner name
    shipped_date = Column(Date)
    shipped_weight = Column(Float)       # grams
    shipment_notes = Column(Text)
    
    # Quality flags
    is_oven_c_era = Column(Boolean, default=False)  # post April 2025
    quality_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    analysis_results = relationship("AnalysisResult", back_populates="graphene_batch")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    graphene_batch_id = Column(UUID(as_uuid=True), ForeignKey("graphene_batches.id"), nullable=False)
    date_analyzed = Column(Date, nullable=False)
    
    # Key measurements for energy storage
    bet_surface_area = Column(Float)     # m²/g (PRIMARY METRIC)
    bet_langmuir = Column(Float)         # m²/g
    conductivity = Column(Float)         # S/m or other unit
    conductivity_unit = Column(String(10), default='S/m')
    
    # Future energy storage metrics
    capacitance = Column(Float)          # F/g (when available)
    pore_size = Column(Float)           # nm (when available)
    
    # Analysis metadata
    analysis_method = Column(String(50)) # BET, 4-point probe, etc.
    instrument = Column(String(50))
    analyst = Column(String(50))
    
    # File attachments
    sem_images = Column(JSON)            # array of file paths/URLs
    tem_images = Column(JSON)            # array of file paths/URLs
    reports = Column(JSON)               # PDF reports, etc.
    
    comments = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    graphene_batch = relationship("GrapheneBatch", back_populates="analysis_results")

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date_occurred = Column(Date, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    impact_level = Column(String(20))    # "major", "minor", "protocol_change"
    
    # Link to related batches
    affected_batch_ids = Column(JSON)    # array of batch UUIDs
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Equipment(Base):
    __tablename__ = "equipment"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)  # "AV1", "AV5", "Oven C"
    type = Column(String(50))                              # "rotating_oven", "static_oven"
    capacity_grams = Column(Float)
    is_production_ready = Column(Boolean, default=False)   # Oven C = TRUE
    
    installation_date = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Sample data for BET target values (energy storage applications)
BET_TARGETS = {
    "supercapacitor": {
        "excellent": 2000,  # > 2000 m²/g
        "good": 1500,       # 1500-2000 m²/g  
        "acceptable": 1000, # 1000-1500 m²/g
        "poor": 500        # < 1000 m²/g
    },
    "battery": {
        "excellent": 1500,  # > 1500 m²/g
        "good": 1000,       # 1000-1500 m²/g
        "acceptable": 500,  # 500-1000 m²/g
        "poor": 200        # < 500 m²/g
    }
}
