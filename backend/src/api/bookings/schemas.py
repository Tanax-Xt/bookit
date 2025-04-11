import datetime

from pydantic import UUID4, BaseModel, conint, model_validator

from src.api.places.schemas import PlaceResponse
from src.api.users.schemas import UserResponse


class BookingTimeResponse(BaseModel):
    date: datetime.date
    start_second: conint(ge=0, le=86399)
    end_second: conint(ge=0, le=86399)

    @model_validator(mode="after")
    def checks(self):
        start = self.start_second
        end = self.end_second

        if start >= end:
            raise ValueError("End second may not be less or equal than start second")

        return self


class CreateBookingRequest(BookingTimeResponse):
    pass


class BookingResponse(BookingTimeResponse):
    id: UUID4
    user: UserResponse
    place: PlaceResponse
    is_activated_by_user: bool


class UpdateBookingRequest(BookingTimeResponse):
    place_id: UUID4


class GetCurrentBooking(BaseModel):
    user_id: UUID4


class ActivateBookingRequest(BaseModel):
    user_id: UUID4
    secret_id: UUID4
