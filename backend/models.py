from sqlalchemy import Column, Integer, String, Float, Text, Date
from geoalchemy2 import Geometry
from database import Base

class FloodZone(Base):
    __tablename__ = "flood_zones"
    id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String(255), nullable=False)
    elevation_m = Column(Float)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))

class PPSLocation(Base):
    __tablename__ = "pps_locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    capacity = Column(Integer)
    current_pax = Column(Integer, default=0)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))

class SOSRequest(Base):
    __tablename__ = "sos_requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending") # Pending, Dispatched, Rescued
    timestamp = Column(String(100)) # Using ISO string for simplicity
    geom = Column(Geometry(geometry_type='POINT', srid=4326))

class RainfallHistory(Base):
    __tablename__ = "rainfall_history"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    impact_description = Column(Text)
