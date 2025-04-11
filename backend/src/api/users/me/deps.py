from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status

from src.api.auth.deps import OptionalPasswordBearerDepends, PasswordBearerDepends
from src.api.auth.schemas import JWT
from src.api.users.models import User
from src.config import settings
from src.db.deps import SessionDepends


def get_current_user(session: SessionDepends, raw: PasswordBearerDepends) -> User:
    try:
        data = JWT(**jwt.decode(raw, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]))
    except Exception:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Ошибка верификации") from None

    user = session.get(User, data.sub)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не авторизован.")
    return user


def get_current_user_or_none(session: SessionDepends, raw: OptionalPasswordBearerDepends) -> User | None:
    return get_current_user(session, raw) if raw else None


CurrentUserDepends = Annotated[User, Depends(get_current_user)]
CurrentUserOrNoneDepends = Annotated[User | None, Depends(get_current_user_or_none)]
