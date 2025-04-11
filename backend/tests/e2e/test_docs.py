from fastapi import status
from fastapi.testclient import TestClient


def test_get_docs(client: TestClient):
    response = client.get("/api/docs")

    assert response.status_code == status.HTTP_200_OK


def test_get_openapi_json(client: TestClient):
    response = client.get("/api/openapi.json")

    assert response.headers["Content-Type"] == "application/json"
    assert response.status_code == status.HTTP_200_OK
