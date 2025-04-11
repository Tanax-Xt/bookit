import uuid
from typing import TYPE_CHECKING

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.api.users.schemas import UserResponse
from src.db.mixins import AuditMixin
from src.db.models import Base

if TYPE_CHECKING:
    from src.api.places.models import Booking


class User(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(index=True, unique=True)
    name: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(nullable=True)
    password: Mapped[str] = mapped_column()
    role: Mapped[str] = mapped_column(default="guest")  # ["admin", "student", "guest"]
    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="user")
    secret_id: Mapped[str] = mapped_column(UUID(as_uuid=True), default=uuid.uuid4)
    telegram_id: Mapped[int] = mapped_column(nullable=True)

    def to_response(self) -> UserResponse:
        response = UserResponse(
            id=self.id,
            username=self.username,
            name=self.name,
            email=self.email,
            role=self.role,
            created_at=self.created_at,
            updated_at=self.updated_at,
            secret_id=self.secret_id,
            telegram_id=self.telegram_id,
        )
        return response
