from enum import Enum
from typing import Annotated

from pydantic import Field

Capacity = Annotated[
    int,
    Field(
        strict=True,
        ge=1,
        le=1000,
        examples=[100],
    ),
]


class PlaceTypeEnum(str, Enum):
    room = "room"
    seat = "seat"


class AccessLevelEnum(str, Enum):
    public = "guest"
    private = "student"
