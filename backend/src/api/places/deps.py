from typing import Annotated

from fastapi import Depends

from src.api.places.service import PlaceService

PlacesServiceDepends = Annotated[PlaceService, Depends(PlaceService)]
