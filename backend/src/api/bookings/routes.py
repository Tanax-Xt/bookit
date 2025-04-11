import logging
import uuid
from datetime import datetime, time, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse, StreamingResponse
from prometheus_client import Counter

from src.api.bookings.calendar import generate_ics, send_email
from src.api.bookings.deps import BookingsServiceDepends
from src.api.bookings.params import DateParams
from src.api.bookings.schemas import ActivateBookingRequest, BookingResponse, CreateBookingRequest, UpdateBookingRequest
from src.api.places.deps import PlacesServiceDepends
from src.api.tags import Tag
from src.api.users.deps import UserServiceDepends
from src.api.users.me.deps import CurrentUserDepends
from src.api.users.schemas import UserEmailRequest
from src.config import settings
from src.limiter import limiter

new_bookings_count = Counter("new_bookings_total", "Total number of new bookings", ["place_id", "user_id", "role"])
bookings_activated_count = Counter(
    "bookings_activated_total", "Total number of bookings activated", ["place_id", "user_id", "role"]
)

router = APIRouter(prefix="", tags=[Tag.BOOKINGS])


@router.get(
    "/users/me/bookings",
    status_code=status.HTTP_200_OK,
    response_model=list[BookingResponse],
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
    summary="Бронирования пользователя",
    description="Эта ручка позволяет получить все бронирования пользователя.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_bookings_by_user(
    request: Request,
    current_user: CurrentUserDepends,
    booking_service: BookingsServiceDepends,
    place_service: PlacesServiceDepends,
):
    bookings = booking_service.get_bookings_by_user(current_user.id)

    response_list = []
    for booking in bookings:
        response = BookingResponse(
            id=booking.id,
            date=booking.date,
            start_second=booking.start_second,
            end_second=booking.end_second,
            user=current_user.to_response(),
            place=place_service.get_place_by_id(booking.place_id).to_response(),
            is_activated_by_user=booking.is_activated_by_user,
        )
        response_list.append(response)

    return response_list


@router.post(
    "/places/{place_id}/bookings",
    status_code=status.HTTP_200_OK,
    response_model=BookingResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Place not found",
        },
        status.HTTP_409_CONFLICT: {
            "description": "Booking already exists on this date",
        },
    },
    summary="Создание бронирования",
    description="Эта ручка позволяет создать бронирование.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def create_booking(
    request: Request,
    current_user: CurrentUserDepends,
    place_id: uuid.UUID,
    data: CreateBookingRequest,
    place_service: PlacesServiceDepends,
    booking_service: BookingsServiceDepends,
):
    place = place_service.get_place_by_id(place_id)
    if place is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Место не найдено.")

    if not booking_service.is_data_valid(
        date=data.date, start_second=data.start_second, end_second=data.end_second, place_id=place_id
    ):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Бронирование на эту дату уже существует.")

    if not booking_service.user_have_not_booking_on_date(
        date=data.date, start_second=data.start_second, end_second=data.end_second, user_id=current_user.id
    ):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="У Вас уже есть бронирование на данную дату и время")

    logging.warning("Caution - may be difference in timezones")
    logging.warning(f"Booking start {data.start_second // 3600}:{data.start_second % 3600 // 60}")
    logging.warning(f"Booking end {data.end_second // 3600}:{data.end_second % 3600 // 60}")
    booking = booking_service.create_booking(data=data, place_id=place_id, user_id=current_user.id)

    new_bookings_count.labels(place_id=booking.place.name, user_id=current_user.id, role=current_user.role).inc()

    response = BookingResponse(
        id=booking.id,
        date=booking.date,
        start_second=booking.start_second,
        end_second=booking.end_second,
        user=current_user.to_response(),
        place=place.to_response(),
        is_activated_by_user=booking.is_activated_by_user,
    )
    return response


@router.get(
    "/places/{place_id}/bookings",
    status_code=status.HTTP_200_OK,
    response_model=list[BookingResponse],
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Place not found",
        },
    },
    summary="Получение бронирований",
    description="Эта ручка позволяет создать получить все бронирования по месту.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_bookings_by_place(
    request: Request,
    current_user: CurrentUserDepends,
    place_id: uuid.UUID,
    date_params: Annotated[DateParams, Depends(DateParams)],
    booking_service: BookingsServiceDepends,
    place_service: PlacesServiceDepends,
):
    place = place_service.get_place_by_id(place_id)
    if place is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Место не найдено.")

    bookings = booking_service.get_bookings_by_place_with_date_params(place_id, date_params)
    response_list = []

    for booking in bookings:
        response = BookingResponse(
            id=booking.id,
            date=booking.date,
            start_second=booking.start_second,
            end_second=booking.end_second,
            user=booking.user.to_response(),
            place=place_service.get_place_by_id(booking.place_id).to_response(),
            is_activated_by_user=booking.is_activated_by_user,
        )
        response_list.append(response)

    return response_list


@router.get(
    "/bookings/{booking_id}",
    status_code=status.HTTP_200_OK,
    response_model=BookingResponse,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Booking not owned by place",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place or booking not found",
        },
    },
    summary="Получение бронирования",
    description="Эта ручка позволяет получить бронирование по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_booking(
    request: Request,
    current_user: CurrentUserDepends,
    booking_id: uuid.UUID,
    place_service: PlacesServiceDepends,
    booking_service: BookingsServiceDepends,
):
    booking = booking_service.get_booking_by_id(booking_id)

    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    if booking.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете изменять данное бронирование.")

    place = place_service.get_place_by_id(booking.place_id)
    if place is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Место не найдено.")

    response = BookingResponse(
        id=booking.id,
        date=booking.date,
        start_second=booking.start_second,
        end_second=booking.end_second,
        user=current_user.to_response(),
        place=place.to_response(),
        is_activated_by_user=booking.is_activated_by_user,
    )

    return response


@router.patch(
    "/bookings/{booking_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Booking not owned by place or user",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place or booking not found",
        },
        status.HTTP_409_CONFLICT: {
            "description": "Booking already exists on this date",
        },
    },
    summary="Обновление бронирования",
    description="Эта ручка позволяет обновить бронирование по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def update_booking(
    request: Request,
    current_user: CurrentUserDepends,
    booking_id: uuid.UUID,
    data: UpdateBookingRequest,
    place_service: PlacesServiceDepends,
    booking_service: BookingsServiceDepends,
):
    new_place = place_service.get_place_by_id(data.place_id)
    if new_place is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Новое место не найдено.")

    # Нет бронирования
    booking = booking_service.get_booking_by_id(booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    # Бронь уже началась
    booking_start = datetime.combine(booking.date, time()) + timedelta(seconds=booking.start_second)
    logging.warning(f"Booking start: {booking_start}")
    logging.warning(f"Now: {datetime.now()}")
    if booking_start <= datetime.now():
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Нельзя изменять бронь после её начала")

    # Если чужая бронь
    if (
        not booking_service.is_booking_created_by_user(booking_id=booking_id, user_id=current_user.id)
        and current_user.role != "admin"
    ):
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете изменять данное бронирование.")

    # Если уже есть бронь на это время на этом месте
    if not booking_service.is_data_valid(data.date, data.start_second, data.end_second, new_place.id, booking_id):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="Место уже занято на это время")

    # Если у пользователя есть бронь на это время, но она не совпадает с текущей
    if not booking_service.user_have_not_booking_on_date(
        date=data.date,
        start_second=data.start_second,
        end_second=data.end_second,
        user_id=current_user.id,
        booking_id=booking_id,
    ):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="У Вас уже есть бронь на это время")

    booking_service.update_booking(booking_id=booking_id, data=data)
    return HTTPException(status.HTTP_204_NO_CONTENT)


@router.delete(
    "/bookings/{booking_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Booking not owned by place",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place or booking not found",
        },
    },
    summary="Удаление бронирования",
    description="Эта ручка позволяет получить удалить по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def delete_booking(
    request: Request,
    current_user: CurrentUserDepends,
    booking_id: uuid.UUID,
    booking_service: BookingsServiceDepends,
):
    booking = booking_service.get_booking_by_id(booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    if (
        not booking_service.is_booking_created_by_user(booking_id=booking_id, user_id=current_user.id)
        and current_user.role != "admin"
    ):
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете изменять данное бронирование.")

    booking_service.delete_booking(booking_id)
    return HTTPException(status.HTTP_204_NO_CONTENT)


@router.post(
    "/bookings/current",
    status_code=status.HTTP_200_OK,
    response_model=BookingResponse,
    summary="Получение текущего бронирования",
    description="Эта ручка позволяет получить бронирование пользователя на текущую дату.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_current_booking(
    request: Request,
    current_user: CurrentUserDepends,
    booking_service: BookingsServiceDepends,
    data: ActivateBookingRequest,
):
    if current_user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете изменять данное бронирование.")

    booking = booking_service.get_current_booking(data.user_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")
    return booking


@router.post(
    "/bookings/{booking_id}/activate",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Activation is not allowed",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place or booking not found",
        },
    },
    summary="Активация бронирования",
    description="Эта ручка позволяет активировать бронирование по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def activate_booking(
    request: Request,
    current_user: CurrentUserDepends,
    booking_id: str,
    booking_service: BookingsServiceDepends,
    user_service: UserServiceDepends,
    data: ActivateBookingRequest,
):
    booking = booking_service.get_booking_by_id(booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    if current_user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете активировать данное бронирование.")

    user = user_service.get_user_by_id(data.user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")

    if not booking_service.is_booking_created_by_user(booking_id=booking_id, user_id=user.id):
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Бронирование не принадлежит пользователю.")

    booking_service.activate_booking(booking_id=booking_id)

    bookings_activated_count.labels(place_id=booking.place.name, user_id=user.id, role=user.role).inc()

    return HTTPException(status.HTTP_204_NO_CONTENT)


@router.get(
    "/bookings/{booking_id}/ics_file",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Activation is not allowed",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place or booking not found",
        },
    },
    summary="Файл бронирования",
    description="Эта ручка позволяет получить файл .ics бронирования по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_ics_file(
    request: Request,
    current_user: CurrentUserDepends,
    booking_id: str,
    booking_service: BookingsServiceDepends,
    user_service: UserServiceDepends,
):
    booking = booking_service.get_booking_by_id(booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    user = user_service.get_user_by_id(current_user.id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")

    if (
        not booking_service.is_booking_created_by_user(booking_id=booking_id, user_id=user.id)
        and current_user.role != "admin"
    ):
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Бронирование не принадлежит пользователю.")

    ics_file = await generate_ics(booking)
    return StreamingResponse(
        ics_file,
        media_type="text/calendar",
        headers={"Content-Disposition": f"attachment; filename=booking_{booking.date}.ics"},
    )


@router.post(
    "/bookings/{booking_id}/send_mail",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Activation is not allowed",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place or booking not found",
        },
    },
    summary="Отправка email с бронированием",
    description="Эта ручка позволяет отправить информацию о бронировании на email пользователя.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def send_mail(
    request: Request,
    current_user: CurrentUserDepends,
    booking_id: str,
    booking_service: BookingsServiceDepends,
    user_service: UserServiceDepends,
    data: UserEmailRequest,
):
    booking = booking_service.get_booking_by_id(booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    user = user_service.get_user_by_id(current_user.id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")

    if (
        not booking_service.is_booking_created_by_user(booking_id=booking_id, user_id=user.id)
        and current_user.role != "admin"
    ):
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Бронирование не принадлежит пользователю.")

    await send_email(booking, data.email)

    return JSONResponse({"message": f"ICS событие отправлено на {data.email}"})
