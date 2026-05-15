from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import models
from geoalchemy2.shape import to_shape
import json

app = FastAPI(title="FloodGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to FloodGuard API"}

@app.get("/simulate")
def simulate_flood(rainfall: float, db: Session = Depends(database.get_db)):
    # Basic logic: > 50mm Low, > 100mm Moderate, > 150mm High
    risk_level = "Safe"
    if rainfall > 150:
        risk_level = "High"
    elif rainfall > 100:
        risk_level = "Moderate"
    elif rainfall > 50:
        risk_level = "Low"
        
    zones = db.query(models.FloodZone).all()
    features = []
    for zone in zones:
        geom_shape = to_shape(zone.geom)
        features.append({
            "type": "Feature",
            "properties": {
                "name": zone.name,
                "risk_level": risk_level
            },
            "geometry": geom_shape.__geo_interface__
        })
        
    return {
        "risk_level": risk_level,
        "affected_zones": {
            "type": "FeatureCollection",
            "features": features
        }
    }

@app.get("/routing")
def get_routing(lat: float, lng: float, db: Session = Depends(database.get_db)):
    # Fetch all PPS, for a real app, do nearest neighbor using ST_Distance
    pps_list = db.query(models.PPSLocation).all()
    features = []
    for pps in pps_list:
        geom_shape = to_shape(pps.geom)
        features.append({
            "type": "Feature",
            "properties": {
                "name": pps.name,
                "capacity": pps.capacity
            },
            "geometry": geom_shape.__geo_interface__
        })
    return {
        "type": "FeatureCollection",
        "features": features
    }

@app.get("/historical-data")
def get_historical_data(db: Session = Depends(database.get_db)):
    history = db.query(models.RainfallHistory).all()
    return [{"date": h.date, "rainfall_mm": h.rainfall_mm, "impact_description": h.impact_description} for h in history]
