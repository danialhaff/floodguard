-- ============================================
-- FloodGuard DB Initialisation
-- PostgreSQL + PostGIS (SRID 4326)
-- ============================================

-- 1. Enable PostGIS spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. flood_zones table (as requested)
--    id          → SERIAL PRIMARY KEY
--    zone_name   → VARCHAR
--    elevation_m → FLOAT
--    geom        → GEOMETRY Point, SRID 4326
CREATE TABLE IF NOT EXISTS flood_zones (
    id          SERIAL PRIMARY KEY,
    zone_name   VARCHAR(255)        NOT NULL,
    elevation_m FLOAT,
    geom        GEOMETRY(Point, 4326)
);

-- 3. PPS (Relief Centre) locations
CREATE TABLE IF NOT EXISTS pps_locations (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    capacity INT,
    geom     GEOMETRY(Point, 4326)
);

-- 4. Rainfall history log
CREATE TABLE IF NOT EXISTS rainfall_history (
    id                 SERIAL PRIMARY KEY,
    date               DATE  NOT NULL,
    rainfall_mm        FLOAT NOT NULL,
    impact_description TEXT
);

-- ============================================
-- Seed data — Taman Sri Muda
-- ============================================

-- flood_zones: 5 monitoring zones mapped to TSM centroids
INSERT INTO flood_zones (zone_name, elevation_m, geom) VALUES
    ('North Zone',   12.5, ST_SetSRID(ST_MakePoint(101.5340, 3.0375), 4326)),
    ('East Zone',    10.2, ST_SetSRID(ST_MakePoint(101.5450, 3.0308), 4326)),
    ('Central Zone', 8.7,  ST_SetSRID(ST_MakePoint(101.5360, 3.0310), 4326)),
    ('South Zone',   9.1,  ST_SetSRID(ST_MakePoint(101.5370, 3.0230), 4326)),
    ('West Zone',    11.3, ST_SetSRID(ST_MakePoint(101.5265, 3.0290), 4326));

-- pps_locations: 4 real relief centres
INSERT INTO pps_locations (name, capacity, geom) VALUES
    ('Dewan Azalea Seksyen 25',       500,  ST_SetSRID(ST_MakePoint(101.5367, 3.0336), 4326)),
    ('SK Taman Sri Muda',             800,  ST_SetSRID(ST_MakePoint(101.5398, 3.0315), 4326)),
    ('Dewan Kenangan MBSA Seksyen 28',1200, ST_SetSRID(ST_MakePoint(101.5421, 3.0487), 4326)),
    ('SK Seksyen 16 Shah Alam',       1000, ST_SetSRID(ST_MakePoint(101.5189, 3.0576), 4326));

-- rainfall_history: historical flood events at TSM
INSERT INTO rainfall_history (date, rainfall_mm, impact_description) VALUES
    ('2021-12-17', 198.5, 'Major flood — entire TSM inundated, thousands evacuated'),
    ('2021-12-18', 145.2, 'Continued flooding — PPS centres at capacity'),
    ('2022-03-06',  92.0, 'Moderate flood — low-lying areas affected'),
    ('2023-01-15',  55.0, 'Minor flood — road closures at Jalan Kebun'),
    ('2024-11-28',  78.3, 'Flash flood warning issued');
