import datetime
import uuid
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from sqlalchemy.orm import Query

from src.api.bookings.models import Booking
from src.api.bookings.params import DateParams
from src.api.bookings.schemas import CreateBookingRequest, UpdateBookingRequest
from src.api.bookings.service import BookingService


@pytest.fixture
def dummy_session():
    return MagicMock()


@pytest.fixture
def service(dummy_session):
    return BookingService(dummy_session)


def test_get_bookings_by_place_with_date_params(service, dummy_session):
    place_id = uuid.uuid4()
    today = datetime.date.today()
    date_params = DateParams(date=today, start_second=5000, end_second=6000)
    expected_bookings = [SimpleNamespace(id=uuid.uuid4())]

    # Setup chained calls: session.query(Booking).filter(...).all()
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.all.return_value = expected_bookings

    result = service.get_bookings_by_place_with_date_params(place_id, date_params)
    dummy_session.query.assert_called_once_with(Booking)
    assert result == expected_bookings


def test_get_bookings_by_user(service, dummy_session):
    user_id = uuid.uuid4()
    expected_bookings = [SimpleNamespace(id=uuid.uuid4())]

    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.all.return_value = expected_bookings

    result = service.get_bookings_by_user(user_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result == expected_bookings


def test_get_booking_by_id(service, dummy_session):
    booking_id = uuid.uuid4()
    dummy_booking = SimpleNamespace(id=booking_id)
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    result = service.get_booking_by_id(booking_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result == dummy_booking


def test_is_data_valid_true(service, dummy_session):
    # No overlapping booking found => valid
    today = datetime.date.today()
    place_id = str(uuid.uuid4())
    start = 1000
    end = 2000
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    # first() returns None to indicate no overlap
    mock_query.filter.return_value.first.return_value = None

    result = service.is_data_valid(today, start, end, place_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result is True


def test_is_data_valid_false(service, dummy_session):
    # Overlapping booking exists => invalid
    today = datetime.date.today()
    place_id = str(uuid.uuid4())
    start = 1000
    end = 2000
    dummy_booking = SimpleNamespace(id=uuid.uuid4())
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    result = service.is_data_valid(today, start, end, place_id, current_booking_id="some-id")
    dummy_session.query.assert_called_once_with(Booking)
    assert result is False


def test_create_booking(service, dummy_session):
    today = datetime.date.today()
    booking_data = CreateBookingRequest(date=today, start_second=1200, end_second=1800)
    place_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    # Simulate adding and commit behavior.
    dummy_session.add = MagicMock()
    dummy_session.commit = MagicMock()

    new_booking = service.create_booking(booking_data, place_id, user_id)

    # Check that the new booking has correct attributes
    assert new_booking.date == today
    assert new_booking.start_second == 1200
    assert new_booking.end_second == 1800
    assert new_booking.place_id == place_id
    assert new_booking.user_id == user_id
    dummy_session.add.assert_called_once_with(new_booking)
    dummy_session.commit.assert_called_once()


@pytest.mark.skip
def test_delete_booking(service, dummy_session):
    booking_id = uuid.uuid4()
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query

    dummy_session.commit = MagicMock()
    service.delete_booking(booking_id)
    dummy_session.query.assert_called_once_with(Booking)
    mock_query.filter.assert_called()
    mock_query.delete.assert_called_once()
    dummy_session.commit.assert_called_once()


def test_get_booking_by_place_and_id(service, dummy_session):
    place_id = uuid.uuid4()
    booking_id = uuid.uuid4()
    dummy_booking = SimpleNamespace(id=booking_id)
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    result = service.get_booking_by_place_and_id(place_id, booking_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result == dummy_booking


def test_update_booking(service, dummy_session):
    booking_id = uuid.uuid4()
    today = datetime.date.today()
    dummy_booking = SimpleNamespace(
        id=booking_id, date=today, start_second=1000, end_second=2000, place_id=str(uuid.uuid4())
    )
    # Simulate query returns dummy_booking
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    dummy_session.commit = MagicMock()

    update_data = UpdateBookingRequest(date=today, start_second=1100, end_second=1900, place_id=str(uuid.uuid4()))
    service.update_booking(booking_id, update_data)

    assert dummy_booking.date == today
    assert dummy_booking.start_second == 1100
    assert dummy_booking.end_second == 1900
    assert dummy_booking.place_id == update_data.place_id
    dummy_session.commit.assert_called_once()


def test_is_booking_created_by_user(service, dummy_session):
    booking_id = uuid.uuid4()
    user_id = uuid.uuid4()
    dummy_booking = SimpleNamespace(id=booking_id, user_id=user_id)
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    result = service.is_booking_created_by_user(booking_id, user_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result is True


def test_activate_booking(service, dummy_session):
    booking_id = uuid.uuid4()
    dummy_booking = SimpleNamespace(id=booking_id, is_activated_by_user=False)
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    dummy_session.commit = MagicMock()
    service.activate_booking(booking_id)

    assert dummy_booking.is_activated_by_user is True
    dummy_session.commit.assert_called_once()


def test_user_have_not_booking_on_date_true(service, dummy_session):
    today = datetime.date.today()
    user_id = str(uuid.uuid4())
    start = 1000
    end = 2000

    # No overlapping booking exists.
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = None

    result = service.user_have_not_booking_on_date(today, start, end, user_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result is True


def test_user_have_not_booking_on_date_false(service, dummy_session):
    today = datetime.date.today()
    user_id = str(uuid.uuid4())
    start = 1000
    end = 2000
    dummy_booking = SimpleNamespace(id=uuid.uuid4())
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_q = mock_query.filter.return_value
    mock_q.first.return_value = dummy_booking

    result = service.user_have_not_booking_on_date(today, start, end, user_id, booking_id=str(uuid.uuid4()))
    dummy_session.query.assert_called_once_with(Booking)
    assert result is False


def test_get_current_booking(service, dummy_session, monkeypatch):
    # Setup a fixed current datetime
    fixed_now = datetime.datetime(2023, 10, 5, 12, 0, 0)
    # Calculate current seconds: 12 * 3600 = 43200
    expected_seconds = 43200

    # Patch datetime.datetime.now to return fixed_now
    class FixedDatetime(datetime.datetime):
        @classmethod
        def now(cls, tz=None):
            return fixed_now

    monkeypatch.setattr(datetime, "datetime", FixedDatetime)

    dummy_booking = SimpleNamespace(
        id=uuid.uuid4(),
        date=fixed_now.date(),
        start_second=40000,
        end_second=50000,
        user_id=uuid.uuid4(),
    )
    mock_query = MagicMock(spec=Query)
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_booking

    result = service.get_current_booking(dummy_booking.user_id)
    dummy_session.query.assert_called_once_with(Booking)
    assert result == dummy_booking
