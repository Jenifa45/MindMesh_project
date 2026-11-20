
import fastapi.testclient
from app.main import app

client = fastapi.testclient.TestClient(app)


def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "backend start"}


def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "message": "Hello from FastAPI!",
    }


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
