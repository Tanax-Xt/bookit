from fastapi import status
from fastapi.testclient import TestClient


def test_get_root(client: TestClient):
    response = client.get("/")

    assert response.status_code == status.HTTP_200_OK
