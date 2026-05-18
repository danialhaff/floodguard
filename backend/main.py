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

class TokenResponse(BaseModel):
    token: str

class PPSCreate(BaseModel):
    name: str
    capacity: int
    lat: float
    lng: float

class ZoneCreate(BaseModel):
    zone_name: str
    elevation_m: float
    lat: float
    lng: float

class HistoryCreate(BaseModel):
    date: str
    rainfall_mm: float
    impact_description: str

app = FastAPI(title="FloodGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import urllib.request
import urllib.error
import os

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "mock_key_for_demo")

@app.get("/")
def read_root():
    return {"message": "Welcome to FloodGuard API"}

@app.get("/system-info")
def get_system_info():
    return {
        "dem_source": "MYS_alt.vrt",
        "spatial_reference": "SRID 4326 (WGS 84)",
        "processing_method": "Rasterio pixel-to-coordinate extraction",
        "status": "Active"
    }

@app.get("/weather/live")
def get_live_weather():
    lat = 3.0336
    lon = 101.5311
    
    if OPENWEATHER_API_KEY and OPENWEATHER_API_KEY != "mock_key_for_demo":
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                rain_mm = 0.0
                if 'rain' in data and '1h' in data['rain']:
                    rain_mm = data['rain']['1h']
                from datetime import datetime
                return {
                    "location": data.get("name", "Taman Sri Muda"),
                    "temperature_c": data["main"]["temp"],
                    "condition": data["weather"][0]["main"],
                    "rainfall_1h_mm": rain_mm,
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                }
        except Exception as e:
            print(f"OpenWeather API failed (Key might be pending activation): {e}")
            pass # Fallback to mock data below
            
    # MOCK DATA FALLBACK
    import random
    from datetime import datetime
    return {
        "location": "Taman Sri Muda (Fallback)",
        "temperature_c": 27.5,
        "condition": "Heavy Rain",
        "rainfall_1h_mm": round(random.uniform(50.0, 160.0), 1),
        "timestamp": datetime.now().strftime("%H:%M:%S")
    }

@app.get("/simulate")
def simulate_flood(rainfall: float, db: Session = Depends(database.get_db)):
    global_risk = "Safe"
    if rainfall > 150:
        global_risk = "High"
    elif rainfall > 100:
        global_risk = "Moderate"
    elif rainfall > 50:
        global_risk = "Low"
        
    zones = db.query(models.FloodZone).all()
    features = []
    for zone in zones:
        geom_shape = to_shape(zone.geom)
        
        zone_risk = "Safe"
        if rainfall > 0 and zone.elevation_m:
            flood_depth = rainfall / 15.0 
            if flood_depth >= zone.elevation_m * 0.5:
                zone_risk = "High"
            elif flood_depth >= zone.elevation_m * 0.3:
                zone_risk = "Moderate"
            elif flood_depth >= zone.elevation_m * 0.1:
                zone_risk = "Low"
                
        features.append({
            "type": "Feature",
            "properties": {
                "name": zone.zone_name,
                "elevation": zone.elevation_m,
                "risk_level": zone_risk
            },
            "geometry": geom_shape.__geo_interface__
        })
        
    return {
        "risk_level": global_risk,
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

@app.post("/admin/login", response_model=TokenResponse)
def admin_login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin123":
        return {"token": "admin-token-xyz"}
    raise HTTPException(status_code=401, detail="Invalid credentials. Please contact IT support.")

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

@app.post("/admin/zones")
def create_zone(zone: ZoneCreate, db: Session = Depends(database.get_db)):
    new_zone = models.FloodZone(
        zone_name=zone.zone_name,
        elevation_m=zone.elevation_m,
        geom=f"SRID=4326;POINT({zone.lng} {zone.lat})"
    )
    db.add(new_zone)
    db.commit()
    return {"message": "Flood Zone added successfully"}

@app.post("/admin/history")
def create_history(history: HistoryCreate, db: Session = Depends(database.get_db)):
    new_history = models.RainfallHistory(
        date=history.date,
        rainfall_mm=history.rainfall_mm,
        impact_description=history.impact_description
    )
    db.add(new_history)
    db.commit()
    return {"message": "Rainfall history logged successfully"}
