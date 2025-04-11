import uuid
from typing import TYPE_CHECKING

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.api.places.schemas import PlaceResponse
from src.db.mixins import AuditMixin
from src.db.models import Base

if TYPE_CHECKING:
    from src.api.bookings.models import Booking


class Place(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column()
    type: Mapped[str] = mapped_column()  # ["seat", "room"]
    capacity: Mapped[int] = mapped_column()
    access_level: Mapped[str] = mapped_column()  # ["student", "guest"]

    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="place")

    def to_response(self) -> PlaceResponse:
        response = PlaceResponse(
            id=self.id, name=self.name, type=self.type, capacity=self.capacity, access_level=self.access_level
        )
        return response
