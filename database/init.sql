CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE flood_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    geom GEOMETRY(Polygon, 4326)
);

CREATE TABLE pps_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INT,
    geom GEOMETRY(Point, 4326)
);

CREATE TABLE rainfall_history (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    rainfall_mm FLOAT NOT NULL,
    impact_description TEXT
);

-- Insert dummy data for Taman Sri Muda (Approximate center: 3.0333, 101.5333)
INSERT INTO pps_locations (name, capacity, geom) VALUES
('Dewan MBSA Taman Sri Muda', 500, ST_SetSRID(ST_MakePoint(101.5333, 3.0333), 4326)),
('SK Taman Sri Muda', 1000, ST_SetSRID(ST_MakePoint(101.5350, 3.0350), 4326));

-- Dummy zone
INSERT INTO flood_zones (name, geom) VALUES
('Zone A', ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(101.53 3.03, 101.54 3.03, 101.54 3.04, 101.53 3.04, 101.53 3.03)')), 4326));
