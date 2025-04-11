from sqlalchemy import func

from src.api.bookings.models import Booking
from src.api.places.models import Place
from src.api.users.models import User
from src.db.deps import SessionDepends


class StatService:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    # aggregated by user

    def get_user_booking_stats(self):
        results = (
            self.session.query(Booking.user_id, User.username, func.count(Booking.id).label("booking_count"))
            .join(User, Booking.user_id == User.id)
            .group_by(Booking.user_id, User.username)
            .order_by(func.count(Booking.id).desc())
            .all()
        )

        return [
            {"user_id": str(row.user_id), "username": row.username, "booking_count": row.booking_count}
            for row in results
        ]

    def get_user_visits_stats(self):
        results = (
            self.session.query(Booking.user_id, User.username, func.count(Booking.id).label("visit_count"))
            .filter(Booking.is_activated_by_user == True)
            .join(User, Booking.user_id == User.id)
            .group_by(Booking.user_id, User.username)
            .order_by(func.count(Booking.id).desc())
            .all()
        )

        return [
            {"user_id": str(row.user_id), "username": row.username, "visit_count": row.visit_count} for row in results
        ]

    def get_user_place_bookings_stats(self):
        results = (
            self.session.query(
                Booking.user_id,
                User.username,
                Booking.place_id,
                Place.name.label("place_name"),
                func.count(Booking.id).label("booking_count"),
            )
            .join(User, Booking.user_id == User.id)
            .join(Place, Booking.place_id == Place.id)
            .group_by(Booking.user_id, User.username, Booking.place_id, Place.name)
            .order_by(Booking.user_id, func.count(Booking.id).desc())
            .all()
        )

        stats = {}
        for row in results:
            user_id = str(row.user_id)
            place_stats = {
                "place_id": str(row.place_id),
                "place_name": row.place_name,
                "booking_count": row.booking_count,
            }

            if user_id not in stats:
                stats[user_id] = {"username": row.username, "places": []}
            stats[user_id]["places"].append(place_stats)

        return [
            {"user_id": user_id, "username": data["username"], "places": data["places"]}
            for user_id, data in stats.items()
        ]

    def get_user_average_booking_time(self):
        results = (
            self.session.query(
                Booking.user_id,
                User.username,
                func.avg(Booking.end_second - Booking.start_second).label("avg_booking_time"),
            )
            .join(User, Booking.user_id == User.id)
            .group_by(Booking.user_id, User.username)
            .all()
        )

        return [
            {
                "user_id": str(row.user_id),
                "username": row.username,
                "avg_booking_time": int(row.avg_booking_time) if row.avg_booking_time else 0,
            }
            for row in results
        ]

    def get_user_conversion_rate(self):
        booking_stats = self.get_user_booking_stats()
        visit_stats = {stat["user_id"]: stat["visit_count"] for stat in self.get_user_visits_stats()}

        conversion_rates = []
        for booking in booking_stats:
            user_id = booking["user_id"]
            total_bookings = booking["booking_count"]
            visits = visit_stats.get(user_id, 0)

            conversion_rate = visits / total_bookings if total_bookings > 0 else 0
            conversion_rates.append(
                {"user_id": user_id, "username": booking["username"], "conversion_rate": round(conversion_rate, 2)}
            )

        return conversion_rates

    def get_stat_aggregated_by_user(self):
        return {
            "user_booking_stats": self.get_user_booking_stats(),
            "user_visits_stats": self.get_user_visits_stats(),
            "user_place_bookings_stats": self.get_user_place_bookings_stats(),
            "average_booking_time": self.get_user_average_booking_time(),
            "conversion_rate": self.get_user_conversion_rate(),
        }

    def get_place_booking_stats(self):
        results = (
            self.session.query(
                Booking.place_id, Place.name.label("place_name"), func.count(Booking.id).label("booking_count")
            )
            .join(Place, Booking.place_id == Place.id)
            .group_by(Booking.place_id, Place.name)
            .order_by(func.count(Booking.id).desc())
            .all()
        )

        return [
            {"place_id": str(row.place_id), "place_name": row.place_name, "booking_count": row.booking_count}
            for row in results
        ]

    def get_place_visits_stats(self):
        results = (
            self.session.query(
                Booking.place_id, Place.name.label("place_name"), func.count(Booking.id).label("visit_count")
            )
            .filter(Booking.is_activated_by_user == True)
            .join(Place, Booking.place_id == Place.id)
            .group_by(Booking.place_id, Place.name)
            .order_by(func.count(Booking.id).desc())
            .all()
        )

        return [
            {"place_id": str(row.place_id), "place_name": row.place_name, "visit_count": row.visit_count}
            for row in results
        ]

    def get_place_user_bookings_stats(self):
        results = (
            self.session.query(
                Booking.place_id,
                Place.name.label("place_name"),
                Booking.user_id,
                User.username,
                func.count(Booking.id).label("booking_count"),
            )
            .join(Place, Booking.place_id == Place.id)
            .join(User, Booking.user_id == User.id)
            .group_by(Booking.place_id, Place.name, Booking.user_id, User.username)
            .order_by(Booking.place_id, func.count(Booking.id).desc())
            .all()
        )

        stats = {}
        for row in results:
            place_id = str(row.place_id)
            user_stats = {
                "user_id": str(row.user_id),
                "username": row.username,
                "booking_count": row.booking_count,
            }

            if place_id not in stats:
                stats[place_id] = {"place_name": row.place_name, "users": []}
            stats[place_id]["users"].append(user_stats)

        return [
            {"place_id": place_id, "place_name": data["place_name"], "users": data["users"]}
            for place_id, data in stats.items()
        ]

    def get_place_average_booking_time(self):
        results = (
            self.session.query(
                Booking.place_id,
                Place.name.label("place_name"),
                func.avg(Booking.end_second - Booking.start_second).label("avg_booking_time"),
            )
            .join(Place, Booking.place_id == Place.id)
            .group_by(Booking.place_id, Place.name)
            .all()
        )

        return [
            {
                "place_id": str(row.place_id),
                "place_name": row.place_name,
                "avg_booking_time": int(row.avg_booking_time) if row.avg_booking_time else 0,
            }
            for row in results
        ]

    def get_place_conversion_rate(self):
        booking_stats = self.get_place_booking_stats()
        visit_stats = {stat["place_id"]: stat["visit_count"] for stat in self.get_place_visits_stats()}

        conversion_rates = []
        for booking in booking_stats:
            place_id = booking["place_id"]
            total_bookings = booking["booking_count"]
            visits = visit_stats.get(place_id, 0)

            conversion_rate = visits / total_bookings if total_bookings > 0 else 0
            conversion_rates.append(
                {
                    "place_id": place_id,
                    "place_name": booking["place_name"],
                    "conversion_rate": round(conversion_rate, 2),
                }
            )

        return conversion_rates

    def get_stat_aggregated_by_place(self):
        return {
            "place_booking_stats": self.get_place_booking_stats(),
            "place_visits_stats": self.get_place_visits_stats(),
            "place_user_bookings_stats": self.get_place_user_bookings_stats(),
            "average_booking_time": self.get_place_average_booking_time(),
            "conversion_rate": self.get_place_conversion_rate(),
        }

    def get_total_bookings(self) -> int:
        return self.session.query(func.count(Booking.id)).scalar()

    def get_total_visits(self) -> int:
        return self.session.query(func.count(Booking.id)).filter(Booking.is_activated_by_user.is_(True)).scalar()

    def get_total_conversion_rate(self) -> float:
        total_bookings = self.get_total_bookings()
        total_visits = self.get_total_visits()
        return total_visits / total_bookings if total_bookings > 0 else 0

    def get_total_average_booking_time(self) -> int:
        avg_time = self.session.query(func.avg(Booking.end_second - Booking.start_second)).scalar()
        return int(avg_time) if avg_time is not None else 0

    def get_total_stat(self):
        return {
            "total_bookings": self.get_total_bookings(),
            "total_visits": self.get_total_visits(),
            "total_conversion_rate": self.get_total_conversion_rate(),
            "total_avg_booking_time": self.get_total_average_booking_time(),
        }
