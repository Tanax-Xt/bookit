import uuid

from src.api.bookings.models import Booking
from src.api.places.models import Place
from src.api.places.schemas import PlaceAvailableRequest, PlaceAvailableResponse, UpdatePlaceResponse
from src.db.deps import SessionDepends


class PlaceService:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_place_by_id(self, place_id: uuid.UUID) -> Place | None:
        return self.session.query(Place).filter(Place.id == place_id).first()

    def get_place_by_booking_id(self, booking_id: uuid.UUID) -> Place | None:
        return self.session.query(Place).join(Place.bookings).filter(Booking.id == booking_id).first()

    def get_places(self) -> list[Place]:
        return self.session.query(Place).all()

    def get_active_places(
        self, current_user_role: str, request_date: PlaceAvailableRequest
    ) -> list[PlaceAvailableResponse]:
        places = self.session.query(Place).all()

        result = []

        for place in places:
            if current_user_role == "guest":
                if place.access_level != "guest":
                    result.append(
                        PlaceAvailableResponse(
                            id=place.id,
                            name=place.name,
                            type=place.type,
                            capacity=place.capacity,
                            access_level=place.access_level,
                            is_available=False,
                        )
                    )
                    continue

            has_bookings = any(
                (
                    booking.date == request_date.date
                    and (
                        (
                            booking.start_second <= request_date.end_second
                            and booking.start_second >= request_date.start_second
                        )
                        or (
                            booking.end_second <= request_date.end_second
                            and booking.end_second >= request_date.start_second
                        )
                        or (
                            booking.start_second < request_date.start_second
                            and booking.end_second > request_date.end_second
                        )
                    )
                )
                for booking in place.bookings
            )

            is_active = not has_bookings

            result.append(
                PlaceAvailableResponse(
                    id=place.id,
                    name=place.name,
                    type=place.type,
                    capacity=place.capacity,
                    access_level=place.access_level,
                    is_available=is_active,
                )
            )

        return result

    def update_place(self, place_id: uuid.UUID, update_schema: UpdatePlaceResponse):
        place = self.get_place_by_id(place_id)
        place.name = update_schema.name
        place.capacity = update_schema.capacity
        place.access_level = update_schema.access_level
        self.session.commit()
