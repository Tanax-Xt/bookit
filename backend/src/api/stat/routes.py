from fastapi import APIRouter, Request, status

from src.api.stat.deps import StatServiceDepends
from src.api.stat.schemas import StatAggregatedByPlaceResponse, StatAggregatedByUserResponse, StatTotalResponse
from src.api.tags import Tag
from src.config import settings
from src.limiter import limiter

router = APIRouter(prefix="/stat", tags=[Tag.STAT])


@router.get(
    "/users",
    status_code=status.HTTP_200_OK,
    response_model=StatAggregatedByUserResponse,
    summary="Статистика по пользователям",
    description="Эта ручка позволяет получить агрегированную по пользователям статистику.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_stat_aggregated_by_user(request: Request, stats_service: StatServiceDepends):
    return stats_service.get_stat_aggregated_by_user()


@router.get(
    "/places",
    status_code=status.HTTP_200_OK,
    response_model=StatAggregatedByPlaceResponse,
    summary="Статистика по местам",
    description="Эта ручка позволяет получить агрегированную по местам статистику.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_stat_aggregated_by_place(request: Request, stats_service: StatServiceDepends):
    return stats_service.get_stat_aggregated_by_place()


@router.get(
    "/total",
    status_code=status.HTTP_200_OK,
    response_model=StatTotalResponse,
    summary="Суммарная статистика",
    description="Эта ручка позволяет получить суммарную статистику по всем сущностям.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_stat_total(request: Request, stats_service: StatServiceDepends):
    return stats_service.get_total_stat()
