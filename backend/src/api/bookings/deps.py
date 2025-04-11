from typing import Annotated

from fastapi import Depends
from fastapi_mail import FastMail

from src.api.bookings.service import BookingService
from src.config import settings

BookingsServiceDepends = Annotated[BookingService, Depends(BookingService)]

fm = FastMail(settings.MAIL_CONNECTION_CONF)
