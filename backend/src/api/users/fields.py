from enum import Enum
from typing import Annotated

from pydantic import Field, StringConstraints

from src.config import settings

Username = Annotated[
    str,
    StringConstraints(
        strict=True,
        min_length=settings.API_USERNAME_MIN_LENGTH,
        max_length=settings.API_USERNAME_MAX_LENGTH,
        pattern=settings.API_USERNAME_PATTERN,
    ),
    Field(
        examples=["username"],
    ),
]

Password = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        min_length=settings.API_PASSWORD_MIN_LENGTH,
        max_length=settings.API_PASSWORD_MAX_LENGTH,
        pattern=settings.API_PASSWORD_PATTERN,
    ),
    Field(
        examples=["password"],
    ),
]


class RoleEnum(str, Enum):
    admin = "admin"
    guest = "guest"
    student = "student"
