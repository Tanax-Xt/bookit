import uuid
from datetime import date
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from src.api.places.schemas import PlaceAvailableRequest, UpdatePlaceResponse
from src.api.places.service import PlaceService


@pytest.fixture
def dummy_session():
    return MagicMock()


@pytest.fixture
def service(dummy_session):
    return PlaceService(session=dummy_session)


def test_get_place_by_id(service, dummy_session):
    dummy_place = SimpleNamespace(
        id=uuid.uuid4(), name="Test Place", type="room", capacity=10, access_level="guest", bookings=[]
    )
    # Setup the chained call: session.query(Place).filter(Place.id == place_id).first()
    mock_query = MagicMock()
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_place

    result = service.get_place_by_id(dummy_place.id)
    dummy_session.query.assert_called()
    mock_query.filter.assert_called()
    assert result == dummy_place


def test_get_place_by_booking_id(service, dummy_session):
    dummy_place = SimpleNamespace(
        id=uuid.uuid4(), name="Test Place", type="room", capacity=10, access_level="guest", bookings=[]
    )
    # Setup session.query(Place).join(Place.bookings).filter(Booking.id == booking_id).first()
    booking_id = uuid.uuid4()
    mock_query = MagicMock()
    dummy_session.query.return_value = mock_query
    mock_query.join.return_value.filter.return_value.first.return_value = dummy_place

    result = service.get_place_by_booking_id(booking_id)
    dummy_session.query.assert_called()
    mock_query.join.assert_called()
    assert result == dummy_place


def test_get_places(service, dummy_session):
    place1 = SimpleNamespace(
        id=uuid.uuid4(), name="Place 1", type="seat", capacity=1, access_level="guest", bookings=[]
    )
    place2 = SimpleNamespace(
        id=uuid.uuid4(), name="Place 2", type="room", capacity=5, access_level="student", bookings=[]
    )
    dummy_session.query.return_value.all.return_value = [place1, place2]

    result = service.get_places()
    dummy_session.query.assert_called()
    assert result == [place1, place2]


def test_get_active_places_for_guest_without_bookings(service, dummy_session):
    # Guest should see non-guest places as unavailable without even checking bookings.
    place_guest = SimpleNamespace(
        id=uuid.uuid4(), name="Guest Place", type="seat", capacity=2, access_level="guest", bookings=[]
    )
    place_non_guest = SimpleNamespace(
        id=uuid.uuid4(), name="Staff Place", type="room", capacity=3, access_level="student", bookings=[]
    )
    dummy_session.query.return_value.all.return_value = [place_guest, place_non_guest]

    request_date = PlaceAvailableRequest(date=date.today(), start_second=1000, end_second=2000)
    result = service.get_active_places("guest", request_date)

    # For guest places, availability depends on access_level matching guest.
    # place_guest -> available as no conflicting booking.
    # place_non_guest -> forced not available.
    for resp in result:
        if resp.id == place_guest.id:
            assert resp.is_available is True
        elif resp.id == place_non_guest.id:
            assert resp.is_available is False


def test_get_active_places_booking_overlap(service, dummy_session):
    # For non-guest roles, check availability based on bookings.
    # Create two places: one with no overlapping booking, one with a booking overlapping the request.
    place_no_overlap = SimpleNamespace(
        id=uuid.uuid4(),
        name="Free Place",
        type="seat",
        capacity=1,
        access_level="guest",
        bookings=[
            # Booking that does not overlap with request time.
            SimpleNamespace(date=date.today(), start_second=3000, end_second=4000)
        ],
    )
    place_with_overlap = SimpleNamespace(
        id=uuid.uuid4(),
        name="Booked Place",
        type="room",
        capacity=5,
        access_level="guest",
        bookings=[
            # Booking that overlaps with request time.
            SimpleNamespace(date=date.today(), start_second=1500, end_second=2500)
        ],
    )
    dummy_session.query.return_value.all.return_value = [place_no_overlap, place_with_overlap]

    request_date = PlaceAvailableRequest(date=date.today(), start_second=1000, end_second=2000)
    # For non-guest role, access_level check is not applied.
    result = service.get_active_places("admin", request_date)

    for resp in result:
        if resp.id == place_no_overlap.id:
            # Check booking: booking from 3000-4000 does not conflict with 1000-2000.
            assert resp.is_available is True
        elif resp.id == place_with_overlap.id:
            # Booking overlaps with 1000-2000.
            assert resp.is_available is False


def test_update_place(service, dummy_session):
    place_id = uuid.uuid4()
    dummy_place = SimpleNamespace(
        id=place_id, name="Old Name", type="seat", capacity=2, access_level="guest", bookings=[]
    )

    service.get_place_by_id = lambda pid: dummy_place if pid == place_id else None

    update_data = UpdatePlaceResponse(name="New Name", capacity=4, access_level="student")
    service.update_place(place_id, update_data)

    assert dummy_place.name == "New Name"
    assert dummy_place.capacity == 4
    assert dummy_place.access_level == "student"
    dummy_session.commit.assert_called()
