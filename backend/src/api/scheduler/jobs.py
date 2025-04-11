import asyncio
import datetime

from src.api.bookings.models import Booking
from src.api.telegram_bot import bot
from src.api.users.deps import UserServiceDepends
from src.db.deps import SessionDepends


class Jobs:
    def __init__(self, session: SessionDepends, user_service: UserServiceDepends) -> None:
        self.session = session
        self.user_service = user_service

    def delete_expired_bookings(self):
        try:
            now = datetime.datetime.now()
            current_seconds = now.hour * 3600 + now.minute * 60 + now.second
            grace_period = 10 * 60

            # Check expired bookings with a 10-minute buffer
            expired_bookings = (
                self.session.query(Booking)
                .filter(
                    Booking.date <= now.date(),
                    Booking.start_second + grace_period <= current_seconds,
                    Booking.is_activated_by_user == False,
                )
                .all()
            )

            if expired_bookings:
                for booking in expired_bookings:
                    user_id = booking.user_id
                    user = self.user_service.get_user_by_id(user_id)
                    if user.telegram_id is not None:
                        asyncio.run(
                            bot.send_message(
                                user.telegram_id,
                                "Вы не пришли на забронированное место в течение 15 минут, бронь отменена.",
                            )
                        )
                    self.session.delete(booking)
                self.session.commit()

        except Exception:
            self.session.rollback()

    def notify_users_before_booking_start(self):
        try:
            now = datetime.datetime.now()
            current_seconds = now.hour * 3600 + now.minute * 60 + now.second
            notification_period = 15 * 60  # 15 минут в секундах

            upcoming_bookings = (
                self.session.query(Booking)
                .filter(
                    Booking.date == now.date(),
                    Booking.start_second - notification_period <= current_seconds,
                    Booking.start_second > current_seconds,
                )
                .all()
            )

            for booking in upcoming_bookings:
                user = self.user_service.get_user_by_id(booking.user_id)
                if user.telegram_id is not None and booking.notified_start == False:
                    asyncio.run(bot.send_message(user.telegram_id, "Your booking starts in 15 minutes!"))
                    booking.notified_start = True

            self.session.commit()

        except Exception as e:
            print(f"Ошибка при отправке уведомлений: {e}")

    def notify_users_before_booking_end(self):
        try:
            now = datetime.datetime.now()
            current_seconds = now.hour * 3600 + now.minute * 60 + now.second
            notification_period = 15 * 60

            ending_bookings = (
                self.session.query(Booking)
                .filter(
                    Booking.date == now.date(),
                    Booking.end_second - notification_period <= current_seconds,
                    Booking.end_second > current_seconds,
                )
                .all()
            )

            for booking in ending_bookings:
                user = self.user_service.get_user_by_id(booking.user_id)
                if user.telegram_id is not None and booking.notified_end == False:
                    asyncio.run(bot.send_message(user.telegram_id, "Your booking ends up in 15 minutes!"))
                    booking.notified_end = True

            self.session.commit()

        except Exception as e:
            print(f"Ошибка при отправке уведомлений: {e}")
