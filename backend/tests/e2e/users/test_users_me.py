from fastapi import status
from fastapi.testclient import TestClient

from tests.utils.auth import login_user, register_user
from tests.utils.users import VALID_PASSWORD_1, VALID_PASSWORD_2, VALID_USERNAME_1, VALID_USERNAME_2, VALID_USERNAME_3


class TestGetUsersMe:
    def test_get_users_me(self, client: TestClient):
        response = register_user(client, VALID_USERNAME_1, VALID_PASSWORD_1)
        assert response.status_code == status.HTTP_201_CREATED
        token = response.json().get("access_token")
        if not token:
            raise AssertionError

        headers = {
            "Authorization": f"Bearer {token}",
        }
        response = client.get("/api/users/me", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        assert response.json().get("username") == VALID_USERNAME_1

        response = client.get("/api/users/me")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        headers = {
            "Authorization": "Bearer bvijabdvijlbslbvjdbvhj",
        }
        response = client.get("/api/users/me", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_patch_users_me_username(self, client: TestClient):
        assert register_user(client, VALID_USERNAME_2, VALID_PASSWORD_1).status_code == status.HTTP_201_CREATED
        response = login_user(client, VALID_USERNAME_1, VALID_PASSWORD_1)
        assert response.status_code == status.HTTP_200_OK, response.json()
        token = response.json().get("access_token")
        headers = {
            "Authorization": f"Bearer {token}",
        }
        body = {"username": VALID_USERNAME_3}
        response = client.patch("/api/users/me/username", headers=headers, json=body)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        response = client.get("/api/users/me", headers=headers)
        assert response.json().get("username") == body["username"]

        body = {"username": VALID_USERNAME_2}
        response = client.patch("/api/users/me/username", headers=headers, json=body)
        assert response.status_code == status.HTTP_409_CONFLICT

        body = {"username": "g"}
        response = client.patch("/api/users/me/username", headers=headers, json=body)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_patch_users_me_password(self, client: TestClient):
        assert register_user(client, VALID_USERNAME_1, VALID_PASSWORD_1).status_code == status.HTTP_201_CREATED
        response = login_user(client, VALID_USERNAME_1, VALID_PASSWORD_1)
        assert response.status_code == status.HTTP_200_OK, response.json()
        token = response.json().get("access_token")
        headers = {
            "Authorization": f"Bearer {token}",
        }

        body = {"password": VALID_PASSWORD_2}
        response = client.patch("/api/users/me/password", headers=headers, json=body)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        response = login_user(client, VALID_USERNAME_1, VALID_PASSWORD_2)
        assert response.status_code == status.HTTP_200_OK, response.json()

        response = login_user(client, VALID_USERNAME_1, VALID_PASSWORD_1)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED, response.json()

        body = {"password": "g"}
        response = client.patch("/api/users/me/password", headers=headers, json=body)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
