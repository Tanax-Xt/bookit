from logging.config import dictConfig

from src.api.bookings.models import Booking
from src.api.places.models import Place
from src.api.users.models import User
from src.config import settings

dictConfig(settings.LOGGING)

__all__ = ["Booking", "Place", "User"]
