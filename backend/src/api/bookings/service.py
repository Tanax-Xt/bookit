import datetime
import logging
import uuid
from operator import and_
from typing import Optional

from sqlalchemy import or_

from src.api.bookings.models import Booking
from src.api.bookings.params import DateParams
from src.api.bookings.schemas import CreateBookingRequest, UpdateBookingRequest
from src.db.deps import SessionDepends


class BookingService:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_bookings_by_place_with_date_params(self, place_id: uuid.UUID, date_params: DateParams) -> list[Booking]:
        return (
            self.session.query(Booking)
            .filter(
                Booking.place_id == place_id,
                Booking.date == date_params.date,
                or_(Booking.start_second >= date_params.start_second, Booking.end_second <= date_params.end_second),
            )
            .all()
        )

    def get_bookings_by_user(self, user_id: uuid.UUID) -> list[Booking]:
        return self.session.query(Booking).filter(Booking.user_id == user_id).all()

    def get_booking_by_id(self, booking_id: uuid.UUID) -> Booking | None:
        return self.session.query(Booking).filter(Booking.id == booking_id).first()

    def is_data_valid(
        self,
        date: datetime.date,
        start_second: int,
        end_second: int,
        place_id: str,
        current_booking_id: Optional[str] = None,
    ) -> bool:
        """
        Checks if the given booking request is valid by verifying that there are no overlapping bookings
        for the same place and date, except for the current booking (booking_id).
        Returns True if the booking is valid (no overlap with others), otherwise False.
        """

        overlapping_booking = (
            self.session.query(Booking)
            .filter(
                Booking.place_id == place_id,
                Booking.date == date,
                Booking.id != current_booking_id,  # Exclude the current booking from the check
                or_(
                    and_(Booking.start_second < end_second, Booking.end_second > start_second),
                    and_(Booking.start_second >= start_second, Booking.start_second < end_second),
                ),
            )
            .first()
        )

        return overlapping_booking is None

    def create_booking(self, data: CreateBookingRequest, place_id: str, user_id: str) -> Booking:
        new_booking = Booking(
            user_id=user_id,
            place_id=place_id,
            start_second=data.start_second,
            end_second=data.end_second,
            date=data.date,
        )
        self.session.add(new_booking)
        self.session.commit()
        return new_booking

    def delete_booking(self, booking_id: uuid.UUID):
        self.session.query(Booking).filter(Booking.id == booking_id).delete()
        self.session.commit()

    def get_booking_by_place_and_id(self, place_id: uuid.UUID, booking_id: uuid.UUID) -> Booking | None:
        return self.session.query(Booking).filter(Booking.place_id == place_id, Booking.id == booking_id).first()

    def update_booking(self, booking_id: uuid.UUID, data: UpdateBookingRequest):
        booking = self.session.query(Booking).filter(Booking.id == booking_id).first()
        booking.date = data.date
        booking.start_second = data.start_second
        booking.end_second = data.end_second
        booking.place_id = data.place_id
        self.session.commit()

    def is_booking_created_by_user(self, booking_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        booking = self.session.query(Booking).filter(Booking.id == booking_id).first()
        return booking.user_id == user_id

    def activate_booking(self, booking_id: uuid.UUID) -> None:
        booking = self.session.query(Booking).filter(Booking.id == booking_id).first()
        booking.is_activated_by_user = True

        self.session.commit()

    def user_have_not_booking_on_date(
        self, date: datetime.date, start_second: int, end_second: int, user_id: str, booking_id: str | None = None
    ) -> bool | Booking:
        overlapping_booking = self.session.query(Booking).filter(
            Booking.user_id == user_id,
            Booking.date == date,
            or_(
                and_(Booking.start_second < end_second, Booking.end_second > start_second),
                and_(Booking.start_second >= start_second, Booking.start_second < end_second),
            ),
        )
        if booking_id:
            overlapping_booking = overlapping_booking.filter(Booking.id != booking_id)
        overlapping_booking = overlapping_booking.first()

        return overlapping_booking is None

    def get_current_booking(self, user_id: uuid.UUID) -> Booking | None:
        now = datetime.datetime.now() + datetime.timedelta(hours=3)
        current_seconds = now.hour * 3600 + now.minute * 60 + now.second

        logging.warning("Caution - may be difference in timezones")
        logging.warning(f"Current server time: {now.hour}:{now.minute}")
        booking = (
            self.session.query(Booking)
            .filter(
                Booking.user_id == user_id,
                Booking.date == now.date(),
                Booking.start_second <= current_seconds,
                Booking.end_second >= current_seconds,
            )
            .first()
        )

        return booking
