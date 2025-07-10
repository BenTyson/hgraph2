from app.database import engine, Base, SessionLocal
from app.models import *
from datetime import date
import uuid

# Create all tables
Base.metadata.create_all(bind=engine)

# Create session
db = SessionLocal()

try:
    # Add Oven C milestone
    milestone = Milestone(
        date_occurred=date(2025, 4, 1),
        title="Oven C Introduction",
        description="Introduction of new large-scale rotating oven for production-ready batches",
        impact_level="major"
    )
    db.add(milestone)

    # Add equipment records
    equipment_list = [
        Equipment(name="AV1", type="rotating_oven", capacity_grams=100, is_production_ready=False),
        Equipment(name="AV5", type="rotating_oven", capacity_grams=100, is_production_ready=False),
        Equipment(name="C", type="rotating_oven", capacity_grams=500, is_production_ready=True, 
                 installation_date=date(2025, 4, 1)),
    ]
    
    for equipment in equipment_list:
        db.add(equipment)

    # Add sample biochar batches (from your Curia report)
    sample_biochar = [
        BiocharBatch(
            name="MB3047",
            date_created=date(2025, 3, 15),
            oven="AV5",
            operator="Lab Team",
            temperature=180,
            time_hours=24,
            input_weight=80,
            output_weight=22.7,
            yield_percent=28.4,
            water_percent=2.0
        ),
        BiocharBatch(
            name="MB3042", 
            date_created=date(2025, 3, 20),
            oven="AV5",
            operator="Lab Team",
            temperature=180,
            time_hours=24,
            input_weight=80,
            output_weight=20.2,
            yield_percent=25.3,
            water_percent=4.9
        )
    ]

    for batch in sample_biochar:
        db.add(batch)
    
    db.commit()

    # Add sample graphene batches (from your Curia report)
    sample_graphene = [
        GrapheneBatch(
            name="MRa445",
            date_created=date(2025, 7, 8),
            oven="C",
            operator="Dr. Torsten Busch",
            species=1,
            temperature=800,
            time_hours=1,
            grinding_method="mill (3x30 sec)",
            gas_type="N2",
            koh_ratio=1.5,
            appearance="black/grey brittle",
            is_oven_c_era=True,
            quality_notes="Standard output of species 1 process"
        ),
        GrapheneBatch(
            name="MRa440",
            date_created=date(2025, 7, 5),
            oven="C", 
            operator="Dr. Torsten Busch",
            species=1,
            temperature=800,
            time_hours=1,
            grinding_method="mill (3x30 sec)",
            gas_type="N2",
            koh_ratio=1.5,
            appearance="black/grey brittle",
            is_oven_c_era=True,
            quality_notes="Normal yield (48%)"
        ),
        GrapheneBatch(
            name="TB1175B",
            date_created=date(2025, 6, 15),
            oven="C",
            operator="Dr. Torsten Busch", 
            species=1,
            temperature=800,
            time_hours=1,
            shipped_to="Albany",
            shipped_date=date(2025, 6, 20),
            shipped_weight=739,
            is_oven_c_era=True,
            quality_notes="Large batch - shipped for testing"
        )
    ]

    for batch in sample_graphene:
        db.add(batch)
    
    db.commit()

    # Add sample analysis results (from your Curia report BET data)
    graphene_batches = db.query(GrapheneBatch).all()
    batch_lookup = {batch.name: batch.id for batch in graphene_batches}

    sample_analysis = [
        AnalysisResult(
            graphene_batch_id=batch_lookup.get("MRa445"),
            date_analyzed=date(2025, 7, 8),
            bet_surface_area=1650,
            bet_langmuir=1677,
            conductivity=13.7,
            analysis_method="BET",
            analyst="Clariant Analytical Sciences"
        ),
        AnalysisResult(
            graphene_batch_id=batch_lookup.get("MRa440"), 
            date_analyzed=date(2025, 7, 5),
            bet_surface_area=1625,
            bet_langmuir=1650,
            conductivity=13.7,
            analysis_method="BET",
            analyst="Clariant Analytical Sciences"
        ),
        AnalysisResult(
            graphene_batch_id=batch_lookup.get("TB1175B"),
            date_analyzed=date(2025, 6, 16),
            bet_surface_area=1839,
            bet_langmuir=1850,
            conductivity=13.4,
            analysis_method="BET",
            analyst="Clariant Analytical Sciences"
        )
    ]

    for analysis in sample_analysis:
        if analysis.graphene_batch_id:  # Only add if batch exists
            db.add(analysis)

    db.commit()
    print("✅ Database initialized with sample data")
    print("📊 Added:")
    print("   - 3 graphene batches (MRa445, MRa440, TB1175B)")  
    print("   - 2 biochar batches (MB3047, MB3042)")
    print("   - 3 analysis results with BET data")
    print("   - Oven C milestone (April 2025)")
    print("   - Equipment records")

except Exception as e:
    print(f"❌ Error initializing database: {e}")
    db.rollback()
finally:
    db.close()
