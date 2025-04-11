from typing import Any

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from tests.utils.auth import register_user
from tests.utils.users import VALID_PASSWORD_1, VALID_USERNAME_1


class TestAuthRegister:
    def test_auth_register(self, client: TestClient):
        response = register_user(client, VALID_USERNAME_1, VALID_PASSWORD_1)
        assert response.status_code == status.HTTP_201_CREATED

    @pytest.mark.parametrize(
        "data, status_code",
        [
            ({}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"password": VALID_PASSWORD_1}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"username": VALID_USERNAME_1}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"password": "short", "username": VALID_USERNAME_1}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"password": VALID_PASSWORD_1, "username": "j"}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"password": "Password", "username": "john@doe.com"}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            ({"username": VALID_USERNAME_1, "password": VALID_PASSWORD_1}, status.HTTP_409_CONFLICT),
        ],
    )
    def test_auth_register_validation(self, client: TestClient, data: dict[str, Any], status_code: int):
        response = register_user(client, **data)
        assert response.status_code == status_code
