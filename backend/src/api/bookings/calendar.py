import tempfile
from datetime import datetime, time, timedelta, timezone

from fastapi_mail import MessageSchema, MessageType
from ics import Calendar, Event

from src.api.bookings.deps import fm
from src.api.bookings.models import Booking
from src.config import settings


async def generate_ics(booking: Booking):
    cal = Calendar()

    event = Event()
    event.name = f"Место в коворкинге {settings.APP_NAME}"
    event.begin = (
        datetime.combine(booking.date, time(tzinfo=timezone.utc))
        + timedelta(seconds=booking.start_second)
        - timedelta(hours=3)
    )
    event.duration = {"seconds": booking.end_second - booking.start_second}
    event.location = "Москва, ул. Гашека, 7"
    event.description = f"Бронь места {booking.place.name}.\nКоличество посадочных мест: {booking.place.capacity}\nПожалуйста, возьмите с собой документ, удостоверяющий личность!"

    cal.events.add(event)

    return cal.serialize()


async def send_email(booking: Booking, recipient: str):
    ics_content = await generate_ics(booking)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".ics") as temp_file:
        temp_file.write(ics_content.encode("utf-8"))
        temp_file_path = temp_file.name

    message = generate_booking_message(
        recipient, f"Здравствуйте! Ваше бронирование в коворкинг {settings.APP_NAME} оформлено\n", temp_file_path
    )

    await fm.send_message(message)


def generate_booking_message(recipient: str, body: str, ics_file_path: str) -> MessageSchema:
    subject = f"Ваша бронь в коворкинге {settings.APP_NAME}"

    return MessageSchema(
        recipients=[recipient], subject=subject, body=body, subtype=MessageType.html, attachments=[ics_file_path]
    )
