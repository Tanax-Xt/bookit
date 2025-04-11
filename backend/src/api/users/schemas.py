from datetime import datetime

from pydantic import UUID4, BaseModel, EmailStr, Field

from src.api.users.fields import Password, RoleEnum, Username


class UserUsernameRequest(BaseModel):
    """Represents the user username request details."""

    username: Username


class UserPasswordRequest(BaseModel):
    """Represents the user password request details."""

    password: Password


class UserRoleRequest(BaseModel):
    """Represents the user role request details."""

    role: RoleEnum


class UserNameRequest(BaseModel):
    """Represents the user name request details."""

    name: str


class UserEmailRequest(BaseModel):
    """Represents the user email request details."""

    email: EmailStr = Field(min_length=6, max_length=120)


class UserRegistrationRequest(UserUsernameRequest, UserPasswordRequest):
    """Represents the user registration details."""

    role: RoleEnum = "guest"


class UserResponse(UserUsernameRequest, UserRoleRequest):
    """Represents the public response data for a user."""

    id: UUID4
    name: str | None
    email: str | None
    secret_id: UUID4
    telegram_id: int | None
    created_at: datetime
    updated_at: datetime


class AttachTelegramRequest(BaseModel):
    user_id: UUID4
    telegram_id: int
