from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from src.config import settings

oauth2_bearer = OAuth2PasswordBearer(settings.API_TOKEN_URL)
optional_oauth2_bearer = OAuth2PasswordBearer(settings.API_TOKEN_URL, auto_error=False)

PasswordBearerDepends = Annotated[str, Depends(oauth2_bearer)]
OptionalPasswordBearerDepends = Annotated[str, Depends(oauth2_bearer)]

PasswordRequestFormDepends = Annotated[OAuth2PasswordRequestForm, Depends()]

__all__ = [
    "PasswordBearerDepends",
    "PasswordRequestFormDepends",
]
