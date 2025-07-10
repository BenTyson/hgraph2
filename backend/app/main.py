from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import batches, analysis, dashboard, import_data
from app.database import engine, Base
import uvicorn
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HGraph2 Data & Analysis API",
    description="Hemp-derived graphene experimental data management and analysis",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
if os.path.exists("../uploads"):
    app.mount("/uploads", StaticFiles(directory="../uploads"), name="uploads")

# Include API routers
app.include_router(batches.router, prefix="/api/v1/batches", tags=["batches"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(import_data.router, prefix="/api/v1/import", tags=["import"])

@app.get("/")
async def root():
    return {
        "message": "HGraph2 Data & Analysis API", 
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
