import datetime
import uuid

from pydantic import BaseModel, conint, model_validator

from src.api.places.fields import AccessLevelEnum, Capacity, PlaceTypeEnum


class PlaceResponse(BaseModel):
    """Represents the public response data for a place."""

    id: uuid.UUID
    name: str
    type: PlaceTypeEnum
    capacity: Capacity
    access_level: AccessLevelEnum


class PlaceAvailableResponse(PlaceResponse):
    """Represents the public response data for a place."""

    is_available: bool


class PlaceAvailableRequest(BaseModel):
    """Represents the public request data for a place."""

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


class UpdatePlaceResponse(BaseModel):
    name: str
    capacity: Capacity
    access_level: AccessLevelEnum
