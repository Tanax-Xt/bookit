# Функция для удаления неактивных записей
<<<<<<< HEAD
from datetime import timedelta
import datetime
=======
import datetime
from datetime import timedelta
>>>>>>> 094c5bdbc014dba81a2a6f0796da32c0b661d49d
from operator import and_

from src.api.bookings.models import Booking
from src.db.deps import get_session


def delete_old_entries():
    with next(get_session()) as db:  # Используем get_session()
        now = datetime.datetime.now(datetime.UTC)

        # Вычисляем время, после которого запись считается "старой"
        threshold_time = now - timedelta(minutes=10)

        # Найти записи, у которых прошло 10 минут после (date + start_seconds)
<<<<<<< HEAD
        entries = db.query(Booking).filter(
            and_(
                (Booking.date + timedelta(seconds=Booking.start_second)) < threshold_time,
                Booking.is_activated_by_user.is_(False)
            )
        ).all()
=======
        entries = (
            db.query(Booking)
            .filter(
                and_(
                    (Booking.date + timedelta(seconds=Booking.start_second)) < threshold_time,
                    Booking.is_activated_by_user.is_(False),
                )
            )
            .all()
        )
>>>>>>> 094c5bdbc014dba81a2a6f0796da32c0b661d49d

        for entry in entries:
            db.delete(entry)

        db.commit()
