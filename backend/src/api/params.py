from dataclasses import dataclass

from src.config import settings


@dataclass
class SearchParams:
    q: str | None = None
    offset: int = 0
    limit: int = settings.API_SEARCH_PARAMS_MAX_LIMIT
