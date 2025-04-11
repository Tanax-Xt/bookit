from fastapi import APIRouter

from src.api import auth, bookings, places, stat, users

router = APIRouter(prefix="/api")

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(places.router)
router.include_router(bookings.router)
router.include_router(stat.router)

__all__ = [
    "router",
]
