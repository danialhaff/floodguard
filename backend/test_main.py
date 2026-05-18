from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_api_health():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to FloodGuard API"}

def test_simulate_flood_logic():
    # Test high rainfall scenario
    response = client.get("/simulate?rainfall=160")
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "High"
    assert "affected_zones" in data
