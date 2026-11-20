
import pytest
import fastapi.testclient


from app.main import app


@pytest.fixture
def client():
    with fastapi.testclient.TestClient(app) as test_client:
        yield test_client
        
      

