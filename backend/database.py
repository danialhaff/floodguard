import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

logger = logging.getLogger("floodguard.db")
logging.basicConfig(level=logging.INFO)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/floodguard")

def setup_sqlite_spatial_functions(engine):
    import shapely.wkt
    import shapely.wkb

    def geom_from_ewkt(ewkt):
        if not ewkt:
            return None
        s = str(ewkt)
        if 'POINT' in s.upper():
            idx = s.upper().index('POINT')
            g = shapely.wkt.loads(s[idx:])
            return shapely.wkb.dumps(g, srid=4326)
        return None

    @event.listens_for(engine, "connect")
    def connect_listener(conn, record):
        conn.create_function("InitSpatialMetaData", 0, lambda: 1)
        conn.create_function("InitSpatialMetaData", 1, lambda x: 1)
        conn.create_function("RecoverGeometryColumn", 5, lambda *a: 1)
        conn.create_function("DiscardGeometryColumn", 2, lambda *a: 1)
        conn.create_function("CreateSpatialIndex", 2, lambda *a: 1)
        conn.create_function("GeomFromEWKT", 1, geom_from_ewkt)
        conn.create_function("AsEWKB", 1, lambda x: x)
        conn.create_function("AsBinary", 1, lambda x: x)

def init_engine():
    global DATABASE_URL
    if DATABASE_URL.startswith("postgresql://"):
        psycopg2_url = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
        try:
            test_engine = create_engine(psycopg2_url, connect_args={"connect_timeout": 3})
            with test_engine.connect() as conn:
                logger.info("Connected to PostgreSQL successfully.")
            return test_engine
        except Exception as e:
            logger.warning(f"PostgreSQL connection unavailable ({e}). Using local SQLite database.")
    
    sqlite_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "floodguard.db")
    sqlite_url = f"sqlite:///{sqlite_db_path}"
    sqlite_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    setup_sqlite_spatial_functions(sqlite_engine)
    return sqlite_engine

engine = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_default_data(db):
    from geoalchemy2 import WKTElement
    from datetime import date
    import models

    # 1. Flood zones
    if db.query(models.FloodZone).count() == 0:
        zones = [
            models.FloodZone(zone_name='North Zone', elevation_m=12.5, geom=WKTElement('POINT(101.5340 3.0375)', srid=4326)),
            models.FloodZone(zone_name='East Zone', elevation_m=10.2, geom=WKTElement('POINT(101.5450 3.0308)', srid=4326)),
            models.FloodZone(zone_name='Central Zone', elevation_m=8.7, geom=WKTElement('POINT(101.5360 3.0310)', srid=4326)),
            models.FloodZone(zone_name='South Zone', elevation_m=9.1, geom=WKTElement('POINT(101.5370 3.0230)', srid=4326)),
            models.FloodZone(zone_name='West Zone', elevation_m=11.3, geom=WKTElement('POINT(101.5265 3.0290)', srid=4326)),
        ]
        db.add_all(zones)

    # 2. PPS locations
    if db.query(models.PPSLocation).count() == 0:
        pps = [
            models.PPSLocation(name='Dewan Azalea Seksyen 25', capacity=500, current_pax=120, geom=WKTElement('POINT(101.5367 3.0336)', srid=4326)),
            models.PPSLocation(name='SK Taman Sri Muda', capacity=800, current_pax=350, geom=WKTElement('POINT(101.5398 3.0315)', srid=4326)),
            models.PPSLocation(name='Dewan Kenangan MBSA Seksyen 28', capacity=1200, current_pax=200, geom=WKTElement('POINT(101.5421 3.0487)', srid=4326)),
            models.PPSLocation(name='SK Seksyen 16 Shah Alam', capacity=1000, current_pax=80, geom=WKTElement('POINT(101.5189 3.0576)', srid=4326)),
        ]
        db.add_all(pps)

    # 3. Rainfall history
    if db.query(models.RainfallHistory).count() == 0:
        history = [
            models.RainfallHistory(date=date(2021, 12, 17), rainfall_mm=198.5, impact_description='Major flood — entire TSM inundated, thousands evacuated'),
            models.RainfallHistory(date=date(2021, 12, 18), rainfall_mm=145.2, impact_description='Continued flooding — PPS centres at capacity'),
            models.RainfallHistory(date=date(2022, 3, 6), rainfall_mm=92.0, impact_description='Moderate flood — low-lying areas affected'),
            models.RainfallHistory(date=date(2023, 1, 15), rainfall_mm=55.0, impact_description='Minor flood — road closures at Jalan Kebun'),
            models.RainfallHistory(date=date(2024, 11, 28), rainfall_mm=78.3, impact_description='Flash flood warning issued'),
        ]
        db.add_all(history)

    # 4. SOS requests seed
    if db.query(models.SOSRequest).count() == 0:
        sos_seeds = [
            models.SOSRequest(name='Siti Aminah', phone='012-3456789', status='Pending', timestamp='2026-10-28T09:15:00', geom=WKTElement('POINT(101.5350 3.0315)', srid=4326)),
            models.SOSRequest(name='Tan Wei Meng', phone='017-8899123', status='Dispatched', timestamp='2026-10-28T09:40:00', geom=WKTElement('POINT(101.5372 3.0298)', srid=4326)),
        ]
        db.add_all(sos_seeds)

    db.commit()

