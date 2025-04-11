import uuid

from fastapi import APIRouter, HTTPException, Request, status

from src.api.places.deps import PlacesServiceDepends
from src.api.places.schemas import PlaceAvailableRequest, PlaceAvailableResponse, PlaceResponse, UpdatePlaceResponse
from src.api.tags import Tag
from src.api.users.me.deps import CurrentUserDepends
from src.config import settings
from src.limiter import limiter

router = APIRouter(prefix="/places", tags=[Tag.PLACES])


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[PlaceResponse],
    summary="Получение всех мест",
    description="Эта ручка позволяет получить все места коворкинга.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_places(request: Request, current_user: CurrentUserDepends, place_service: PlacesServiceDepends):
    return place_service.get_places()


@router.post(
    "/availability",
    status_code=status.HTTP_200_OK,
    response_model=list[PlaceAvailableResponse],
    summary="Получение всех мест с доступностью",
    description="Эта ручка позволяет получить все места коворкинга с указанием доступности на текущую дату.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_places_access_availability(
    request: Request,
    current_user: CurrentUserDepends,
    schema: PlaceAvailableRequest,
    place_service: PlacesServiceDepends,
):
    return place_service.get_active_places(current_user.role, schema)


@router.get(
    "/{place_id}",
    status_code=status.HTTP_200_OK,
    response_model=PlaceResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Place not found",
        },
    },
    summary="Получение места",
    description="Эта ручка позволяет получить место в коворкинге по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_place(
    request: Request, current_user: CurrentUserDepends, place_id: uuid.UUID, place_service: PlacesServiceDepends
):
    place = place_service.get_place_by_id(place_id)
    if not place:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return place


@router.patch(
    "/{place_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "User not allowed to update place",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Place not found",
        },
    },
    summary="Обновление места",
    description="Эта ручка позволяет обновить место в коворкинге по id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def update_place(
    request: Request,
    current_user: CurrentUserDepends,
    place_id: uuid.UUID,
    update_schema: UpdatePlaceResponse,
    place_service: PlacesServiceDepends,
):
    if current_user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете изменять данное место.")

    place_service.update_place(place_id, update_schema)
    return HTTPException(status.HTTP_204_NO_CONTENT)
