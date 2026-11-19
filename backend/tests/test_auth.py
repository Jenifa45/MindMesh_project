
def test_me_without_token_returns_401(client):
    response = client.get("/me")

    assert response.status_code == 401


def test_me_with_malformed_token_returns_401(client):
    response = client.get(
        "/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401


def test_me_with_invalid_jwt_returns_401(client, monkeypatch):
    import httpx

    async def mock_get(*args, **kwargs):
        return httpx.Response(
            status_code=401,
            json={"message": "Invalid JWT"},
        )

    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get)

    response = client.get(
        "/me",
        headers={"Authorization": "Bearer invalid.jwt.token"},
    )

    assert response.status_code == 401

