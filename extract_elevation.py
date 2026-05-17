"""
FloodGuard KL — Raster-to-Spatial-Database Extraction
Author: Muhammad Danial Hafiz (UniKL Software Engineering)

Reads Malaysia elevation raster (MYS_alt.vrt) via rasterio,
extracts elevation at Taman Sri Muda zone centroids,
and INSERTs the results into the PostGIS 'flood_zones' table.
"""

import os
import sys
import numpy as np
import rasterio
import psycopg2

# ---- Configuration ----
RASTER_PATH = os.path.join(os.path.dirname(__file__), "data", "raster", "MYS_alt.vrt")

DB_CONFIG = {
    "host":     "localhost",
    "port":     5432,
    "dbname":   "floodguard",
    "user":     "user",
    "password": "password",
}

# Taman Sri Muda zone centroids (Lat, Lon)
# These correspond to the 5 evacuation zones in the FloodGuard system
TSM_ZONES = [
    {"zone_name": "TSM North Zone",   "lat": 3.0375, "lon": 101.5340},
    {"zone_name": "TSM East Zone",    "lat": 3.0308, "lon": 101.5450},
    {"zone_name": "TSM Central Zone", "lat": 3.0310, "lon": 101.5360},
    {"zone_name": "TSM South Zone",   "lat": 3.0230, "lon": 101.5370},
    {"zone_name": "TSM West Zone",    "lat": 3.0290, "lon": 101.5265},
    # Primary point requested: Taman Sri Muda centre
    {"zone_name": "Taman Sri Muda (Centre)", "lat": 3.0336, "lon": 101.5311},
]


def extract_elevation(raster_path, lon, lat):
    """
    Extract elevation value from a raster file at a given (lon, lat).
    Returns elevation in metres, or None if the point falls outside the raster.
    """
    with rasterio.open(raster_path) as src:
        # Convert geographic coordinates to raster pixel row/col
        row, col = src.index(lon, lat)
        # Read the single pixel value from band 1
        val = src.read(1, window=rasterio.windows.Window(col, row, 1, 1))
        elevation = float(val[0, 0])
        # Handle nodata
        if src.nodata is not None and np.isclose(elevation, src.nodata):
            return None
        return round(elevation, 2)


def main():
    # ---- Step 1: Validate raster file ----
    print("=" * 60)
    print("FloodGuard KL — Raster to Spatial DB Extraction")
    print("=" * 60)

    if not os.path.exists(RASTER_PATH):
        print(f"[ERROR] Raster file not found: {RASTER_PATH}")
        sys.exit(1)

    with rasterio.open(RASTER_PATH) as src:
        print(f"\n[RASTER INFO]")
        print(f"  File   : {RASTER_PATH}")
        print(f"  CRS    : {src.crs}")
        print(f"  Bounds : {src.bounds}")
        print(f"  Size   : {src.width} x {src.height} pixels")
        print(f"  Bands  : {src.count}")
        print(f"  NoData : {src.nodata}")

    # ---- Step 2: Extract elevations ----
    print(f"\n[EXTRACTING ELEVATIONS]")
    results = []
    for zone in TSM_ZONES:
        elev = extract_elevation(RASTER_PATH, zone["lon"], zone["lat"])
        results.append({**zone, "elevation_m": elev})
        status = f"{elev} m" if elev is not None else "NO DATA"
        print(f"  {zone['zone_name']:30s}  Lat {zone['lat']:.4f}, Lon {zone['lon']:.4f}  ->  {status}")

    # ---- Step 3: Insert into PostGIS ----
    print(f"\n[DATABASE INSERT]")
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Clear old TSM extracted data to avoid duplicates
    cur.execute("DELETE FROM flood_zones WHERE zone_name LIKE 'TSM %' OR zone_name LIKE 'Taman Sri Muda%';")

    insert_sql = """
        INSERT INTO flood_zones (zone_name, elevation_m, geom)
        VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
    """

    for r in results:
        cur.execute(insert_sql, (r["zone_name"], r["elevation_m"], r["lon"], r["lat"]))
        print(f"  [OK] Inserted: {r['zone_name']}  elev={r['elevation_m']} m")

    conn.commit()
    print(f"\n  Total rows inserted: {len(results)}")

    # ---- Step 4: Verification query ----
    print(f"\n[VERIFICATION — SELECT * FROM flood_zones]")
    cur.execute("SELECT id, zone_name, elevation_m, ST_AsText(geom) AS geom_wkt FROM flood_zones ORDER BY id;")
    rows = cur.fetchall()
    print(f"  {'ID':<5} {'Zone Name':<30} {'Elev (m)':<12} {'Geometry (WKT)'}")
    print(f"  {'---':<5} {'---':<30} {'---':<12} {'---':<30}")
    for row in rows:
        print(f"  {row[0]:<5} {row[1]:<30} {str(row[2]):<12} {row[3]}")

    print(f"\n  Total rows in flood_zones: {len(rows)}")

    cur.close()
    conn.close()
    print(f"\n{'=' * 60}")
    print("[OK] Raster-to-Spatial-DB extraction complete!")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
