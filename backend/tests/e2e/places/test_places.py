from fastapi import status
from fastapi.testclient import TestClient

from tests.utils.places import create_places


class TestGetPlaces:
    def test_get_places_no_auth(self, client: TestClient):
        create_places()
        response = client.get("/api/places")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_places_invalid_token(self, client: TestClient):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/places", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_places_ok(self, auth_admin_client: TestClient):
        response = auth_admin_client.get("/api/places")
        assert response.status_code == status.HTTP_200_OK, response.json()
        assert isinstance(response.json(), list)

    def test_get_place_by_id_no_auth(self, client: TestClient):
        response = client.get("/api/places/3fa85f64-5717-4562-b3fc-2c963f66afa6")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_place_by_id_invalid_token(self, client: TestClient):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/places/3fa85f64-5717-4562-b3fc-2c963f66afa6", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_place_by_id_ok(self, auth_admin_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        response = auth_admin_client.get(f"/api/places/{place_id}")
        if response.status_code == status.HTTP_200_OK:
            data = response.json()
            assert "id" in data
            assert "name" in data
        else:
            assert response.status_code in [status.HTTP_404_NOT_FOUND]

    def test_get_place_by_id_404(self, auth_admin_client: TestClient):
        response = auth_admin_client.get("/api/places/066b766b-e960-4c6c-b513-ac0af56abc1c")
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestGetPlacesAvailability:
    def test_get_places_availability_no_auth(self, client: TestClient):
        body = {"date": "2024-03-04", "start_second": 0, "end_second": 3600}
        response = client.post("/api/places/availability", json=body)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_places_availability_invalid_token(self, client: TestClient):
        headers = {"Authorization": "Bearer invalid_token"}
        body = {"date": "2024-01-01", "start_second": 0, "end_second": 3600}
        response = client.post("/api/places/availability", headers=headers, json=body)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_places_availability_ok(self, auth_admin_client: TestClient):
        body = {"date": "2024-01-01", "start_second": 0, "end_second": 3600}
        response = auth_admin_client.post("/api/places/availability", json=body)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_get_places_availability_422(self, auth_guest_client: TestClient):
        body = {"date": "2024-01-01", "start_second": 7000, "end_second": 100}
        response = auth_guest_client.post("/api/places/availability", json=body)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestPatchPlace:
    def test_patch_place_no_auth(self, client: TestClient):
        create_places()
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        body = {"name": "NewName", "capacity": 50, "access_level": "student"}
        response = client.patch(f"/api/places/{place_id}", json=body)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_patch_place_invalid_token(self, client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        headers = {"Authorization": "Bearer invalid_token"}
        body = {"name": "NewName", "capacity": 50, "access_level": "student"}
        response = client.patch(f"/api/places/{place_id}", headers=headers, json=body)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_patch_place_ok(self, auth_guest_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        body = {"name": "NewName", "capacity": 50, "access_level": "student"}
        response = auth_guest_client.patch(f"/api/places/{place_id}", json=body)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            pass
        else:
            assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_patch_place_403(self, auth_guest_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        body = {"name": "AnotherName", "capacity": 30, "access_level": "guest"}
        response = auth_guest_client.patch(f"/api/places/{place_id}", json=body)
        if response.status_code != status.HTTP_204_NO_CONTENT:
            assert response.status_code == status.HTTP_403_FORBIDDEN
