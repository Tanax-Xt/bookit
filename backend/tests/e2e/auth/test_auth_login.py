from typing import Any

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from tests.utils.auth import register_user
from tests.utils.users import VALID_PASSWORD_1, VALID_USERNAME_1


class TestAuthLogin:
    def test_auth_login(self, client: TestClient):
        assert register_user(client, VALID_USERNAME_1, VALID_PASSWORD_1).status_code == status.HTTP_201_CREATED
        response = client.post("/api/auth/login", data={"username": VALID_USERNAME_1, "password": VALID_PASSWORD_1})
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize(
        "data, status_code",
        [
            ({}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"password": VALID_PASSWORD_1}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"username": VALID_USERNAME_1}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"password": "Incorrect", "username": VALID_USERNAME_1}, status.HTTP_401_UNAUTHORIZED),
            ({"password": VALID_PASSWORD_1, "username": "Incorrect"}, status.HTTP_404_NOT_FOUND),
            ({"password": "Incorrect", "username": "Incorrect"}, status.HTTP_404_NOT_FOUND),
            ({"password": VALID_PASSWORD_1, "username": VALID_USERNAME_1}, status.HTTP_200_OK),
        ],
    )
    def test_auth_login_validation(self, client: TestClient, data: dict[str, Any], status_code: int):
        response = client.post("/api/auth/login", data=data)
        assert response.status_code == status_code
