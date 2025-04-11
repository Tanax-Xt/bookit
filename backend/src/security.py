from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext

from src.api.auth.schemas import JWT, AccessTokenResponse
from src.config import settings

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: Any, minutes: int = settings.JWT_EXPIRE_MINUTES) -> AccessTokenResponse:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    to_encode = JWT(exp=expires_at, sub=str(subject))
    access_token = jwt.encode(to_encode.model_dump(), settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return AccessTokenResponse(access_token=str(access_token), expires_at=expires_at)


def is_valid_password(plain_password: str, hashed_password: str) -> bool:
    return crypt_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return crypt_context.hash(password)


__all__ = [
    "create_access_token",
    "is_valid_password",
    "get_password_hash",
]
