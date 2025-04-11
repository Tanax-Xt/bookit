import uuid
from datetime import datetime
from time import sleep, time

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from tests.utils.bookings import create_booking
from tests.utils.places import create_places


class TestGetUserBookings:
    def test_get_user_bookings_no_auth(self, client: TestClient):
        response = client.get("/api/users/me/bookings")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_user_bookings_invalid_token(self, client: TestClient):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/users/me/bookings", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_user_bookings_ok(self, auth_guest_client: TestClient):
        response = auth_guest_client.get("/api/users/me/bookings")
        assert response.status_code == status.HTTP_200_OK, response.json()


class TestCreateBooking:
    def test_create_booking_no_auth(self, client: TestClient):
        response = client.post("/api/places/{place_id}/bookings")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_booking_ok(self, auth_guest_client: TestClient):
        create_places()

        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        data = {"date": "2025-03-06", "start_second": 10 * 3600, "end_second": 11 * 3600}
        response = auth_guest_client.post(f"/api/places/{place_id}/bookings", json=data)
        assert response.status_code == status.HTTP_200_OK, response.json()

    def test_create_booking_conflict(self, auth_guest_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        data = {"date": "2025-03-06", "start_second": 10 * 3600, "end_second": 11 * 3600}
        response = auth_guest_client.post(f"/api/places/{place_id}/bookings", json=data)
        assert response.status_code == status.HTTP_409_CONFLICT


class TestGetBookingsByPlace:
    def test_get_place_bookings_no_auth(self, client: TestClient):
        create_places()
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        response = client.get(f"/api/places/{place_id}/bookings")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_place_bookings_invalid_token(self, client: TestClient):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/places/{place_id}/bookings", headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_place_bookings_ok(self, auth_admin_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        query_params = {"date": "2024-03-06", "start_second": 1000, "end_second": 2000}
        response = auth_admin_client.get(f"/api/places/{place_id}/bookings", params=query_params)
        assert response.status_code == status.HTTP_200_OK, response.json()

    def test_get_place_bookings_404(self, auth_admin_client: TestClient):
        query_params = {"date": "2024-03-06", "start_second": 1000, "end_second": 2000}
        response = auth_admin_client.get(
            "/api/places/00000000-0000-0000-0000-000000000000/bookings", params=query_params
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestPatchBooking:
    def test_patch_booking_no_auth(self, client: TestClient):
        create_places()
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        booking_id = "3fa95f64-5717-4562-b3fc-2c963f66afa6"
        response = client.patch(f"/api/bookings/{booking_id}")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_patch_booking_in_the_past(self, auth_admin_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        booking_id = create_booking(
            client=auth_admin_client, place_id=place_id, date="2024-03-06", start_second=1000, end_second=2000
        ).get("id")
        assert booking_id
        data = {"date": "2000-01-01", "start_second": 1000, "end_second": 2000}
        response = auth_admin_client.patch(f"/api/bookings/{booking_id}", json=data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY, response.json()

    def test_patch_booking_success(self, auth_admin_client: TestClient):
        place_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        booking_response = create_booking(
            client=auth_admin_client, place_id=place_id, date="2025-03-06", start_second=6000, end_second=7000
        )
        booking_id = booking_response.get("id")
        assert booking_id

        updated_data = {"date": "2025-03-06", "start_second": 7000, "end_second": 8000, "place_id": place_id}
        response = auth_admin_client.patch(f"/api/bookings/{booking_id}", json=updated_data)
        assert response.status_code == status.HTTP_204_NO_CONTENT, response.json()


class TestGetBooking:
    def test_get_booking_ok(self, auth_guest_client: TestClient):
        create_places()
        place_id = "a6abc93b-5c12-47b2-b1b4-01ba1ece6dda"
        booking_response = create_booking(
            client=auth_guest_client, place_id=place_id, date="2025-03-06", start_second=6000, end_second=7000
        )
        booking_id = booking_response.get("id")
        assert booking_id

        response = auth_guest_client.get(f"/api/bookings/{booking_id}")
        assert response.status_code == status.HTTP_200_OK, response.json()

    def test_get_booking_404(self, auth_guest_client: TestClient):
        response = auth_guest_client.get("/api/bookings/3fa85f64-5717-4562-b3fc-2c963f66afa6")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.skip
    def test_get_current_booking(self, auth_admin_client: TestClient):
        place_id = "a6abc93b-5c12-47b2-b1b4-01ba1ece6dda"
        sec = (int(time()) % 86400 + 3600 * 3 + 2) % 86400
        booking_response = create_booking(
            client=auth_admin_client,
            place_id=place_id,
            date=datetime.now().date().isoformat(),
            start_second=sec,
            end_second=sec + 3600,
        )
        sleep(3)
        response = auth_admin_client.post(
            "/api/bookings/current", json={"user_id": booking_response["user"]["id"], "secret_id": str(uuid.uuid4())}
        )
        assert response.status_code == status.HTTP_200_OK, response.json()
        assert response.json().get("id") == booking_response.get("id")
