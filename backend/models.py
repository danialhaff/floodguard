from sqlalchemy import Column, Integer, String, Float, Text, Date
from geoalchemy2 import Geometry
from database import Base

class FloodZone(Base):
    __tablename__ = "flood_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    geom = Column(Geometry(geometry_type='POLYGON', srid=4326))

class PPSLocation(Base):
    __tablename__ = "pps_locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    capacity = Column(Integer)
    geom = Column(Geometry(geometry_type='POINT', srid=4326))

class RainfallHistory(Base):
    __tablename__ = "rainfall_history"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    impact_description = Column(Text)
