from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import models
from geoalchemy2.shape import to_shape
import json
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class PPSCreate(BaseModel):
    name: str
    capacity: int
    lat: float
    lng: float

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
                "name": zone.zone_name,
                "elevation": zone.elevation_m,
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

# --- Admin Endpoints ---

@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(database.get_db)):
    zone_count = db.query(models.FloodZone).count()
    pps_count = db.query(models.PPSLocation).count()
    history_count = db.query(models.RainfallHistory).count()
    return {
        "zones": zone_count,
        "pps": pps_count,
        "history": history_count,
        "system_status": "Operational"
    }

@app.get("/admin/zones")
def get_admin_zones(db: Session = Depends(database.get_db)):
    zones = db.query(models.FloodZone).all()
    return [{"id": z.id, "zone_name": z.zone_name, "elevation_m": z.elevation_m} for z in zones]

@app.get("/admin/pps")
def get_admin_pps(db: Session = Depends(database.get_db)):
    pps = db.query(models.PPSLocation).all()
    return [{"id": p.id, "name": p.name, "capacity": p.capacity} for p in pps]

@app.post("/admin/login")
def admin_login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin123":
        return {"token": "admin-token-xyz"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/admin/pps")
def create_pps(pps: PPSCreate, db: Session = Depends(database.get_db)):
    new_pps = models.PPSLocation(
        name=pps.name,
        capacity=pps.capacity,
        geom=f"SRID=4326;POINT({pps.lng} {pps.lat})"
    )
    db.add(new_pps)
    db.commit()
    return {"message": "Created successfully"}

@app.delete("/admin/pps/{pps_id}")
def delete_pps(pps_id: int, db: Session = Depends(database.get_db)):
    pps = db.query(models.PPSLocation).filter(models.PPSLocation.id == pps_id).first()
    if not pps:
        raise HTTPException(status_code=404, detail="PPS not found")
    db.delete(pps)
    db.commit()
    return {"message": "Deleted successfully"}
