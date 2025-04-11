import uuid

from fastapi.testclient import TestClient


def create_booking(client: TestClient, place_id: uuid.UUID, date: str, start_second: int, end_second: int):
    url = f"/api/places/{place_id}/bookings"
    payload = {"date": date, "start_second": start_second, "end_second": end_second}
    response = client.post(url, json=payload)
    assert response.status_code < 400, response.text
    return response.json()
