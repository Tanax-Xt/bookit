from typing import Annotated

from fastapi import Depends

from src.api.stat.service import StatService

StatServiceDepends = Annotated[StatService, Depends(StatService)]
