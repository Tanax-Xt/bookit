import datetime
from dataclasses import dataclass

from pydantic import conint


@dataclass
class DateParams:
    date: datetime.date
    start_second: conint(ge=0, le=86399)
    end_second: conint(ge=0, le=86399)
