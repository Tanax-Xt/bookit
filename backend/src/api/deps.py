from typing import Annotated

from fastapi import Depends, HTTPException, status

from src.api.params import SearchParams
from src.config import settings


def get_search_params(params: SearchParams = Depends(SearchParams)) -> SearchParams:
    if params.limit > settings.API_SEARCH_PARAMS_MAX_LIMIT:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"The limit of {params.limit} exceeds the maximum allowed limit of {settings.API_SEARCH_PARAMS_MAX_LIMIT}.",
        )
    return params


SearchParamsDepends = Annotated[SearchParams, Depends(get_search_params)]
