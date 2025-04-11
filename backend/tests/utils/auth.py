from fastapi.testclient import TestClient
from httpx import Response


def register_user(
    client: TestClient, username: str | None = None, password: str | None = None, role: str | None = "guest"
) -> Response:
    data = {"password": password, "username": username}
    if role:
        data["role"] = role
    response = client.post("/api/auth/register", json=data)
    return response


def login_user(client: TestClient, username: str, password: str) -> Response:
    data = {"password": password, "username": username}
    response = client.post("/api/auth/login", data=data)
    return response
