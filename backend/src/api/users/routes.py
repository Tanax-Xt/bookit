import uuid

from fastapi import APIRouter, HTTPException, Request, Response, status

from src.api.deps import SearchParamsDepends
from src.api.tags import Tag
from src.api.users import me
from src.api.users.deps import UserServiceDepends
from src.api.users.me.deps import CurrentUserDepends
from src.api.users.schemas import (
    AttachTelegramRequest,
    UserEmailRequest,
    UserNameRequest,
    UserResponse,
    UserRoleRequest,
)
from src.config import settings
from src.limiter import limiter

router = APIRouter(prefix="/users", tags=[Tag.USERS])
router.include_router(me.router)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[UserResponse],
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "No users found matching the provided search parameters",
        },
    },
    summary="Получение пользователей",
    description="Эта ручка позволяет получить всех пользователей.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_users(request: Request, search_params: SearchParamsDepends, service: UserServiceDepends):
    users = service.get_users(search_params)

    if not users:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Нет пользователей.")

    return users


@router.get(
    "/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=UserResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "No user found with the provided username",
        },
    },
    summary="Получение пользователя",
    description="Эта ручка позволяет получить пользователя по его id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def get_user(request: Request, user_id: uuid.UUID, service: UserServiceDepends):
    user = service.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Нет пользователей с логином '{user_id}'.")

    return user


@router.patch(
    "/{user_id}/role",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Role successfully updated",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "User not allowed to update role",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
    summary="Изменение роли пользователя",
    description="Эта ручка позволяет изменить роль пользователя по его id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def update_current_user_role(
    request: Request,
    args: UserRoleRequest,
    service: UserServiceDepends,
    current_user: CurrentUserDepends,
    user_id: uuid.UUID,
) -> Response:
    if current_user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете менять роль пользователя.")

    user = service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")
    service.update_role(user, args.role)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{user_id}/update_secret",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Secret successfully updated",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "User not allowed to update secret",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
    summary="Изменение секретного id пользователя",
    description="Эта ручка позволяет изменить секретный id пользователя по его user id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def update_user_secret(
    request: Request,
    service: UserServiceDepends,
    current_user: CurrentUserDepends,
    user_id: uuid.UUID,
) -> Response:
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете менять секрет данного пользователя.")

    user = service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")
    service.update_secret_id(user=user)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{user_id}/name",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Name successfully updated",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "User not allowed to update name",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
    summary="Изменение ФИО пользователя",
    description="Эта ручка позволяет изменить ФИО пользователя по его id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def update_user_name(
    request: Request,
    args: UserNameRequest,
    service: UserServiceDepends,
    current_user: CurrentUserDepends,
    user_id: uuid.UUID,
) -> Response:
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете менять ФИО данного пользователя.")

    user = service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")

    service.update_name(user=user, name=args.name)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{user_id}/email",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Email successfully updated",
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "User not allowed to update email",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "User not found",
        },
    },
    summary="Изменение email пользователя",
    description="Эта ручка позволяет изменить электронную почту пользователя по его id.",
)
@limiter.limit(settings.API_RATE_LIMIT)
async def update_user_email(
    request: Request,
    args: UserEmailRequest,
    service: UserServiceDepends,
    current_user: CurrentUserDepends,
    user_id: uuid.UUID,
) -> Response:
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Вы не можете менять email данного пользователя.")

    user = service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")

    service.update_email(user=user, email=args.email)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/attach-tg",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Привязать Телеграм",
    description="Эта ручка позволяет привязать аккаунт в Телеграм к аккаунту пользователя.",
)
async def attach_telegram(
    request: Request,
    schema: AttachTelegramRequest,
    user_service: UserServiceDepends,
):
    user = user_service.get_user_by_id(schema.user_id)
    if user.telegram_id is None:
        user_service.set_telegram_id(user, schema.telegram_id)

    return HTTPException(status.HTTP_204_NO_CONTENT)
