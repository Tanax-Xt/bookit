from pydantic import UUID4, BaseModel, Field


class UserBookingCountStat(BaseModel):
    user_id: UUID4
    username: str
    booking_count: int


class UserVisitCountStat(BaseModel):
    user_id: UUID4
    username: str
    visit_count: int


class PlaceBookingCountStat(BaseModel):
    place_id: UUID4
    place_name: str
    booking_count: int


class UserPlaceBookingCountStat(BaseModel):
    user_id: UUID4
    username: str
    places: list[PlaceBookingCountStat]


class UserConversionRateStat(BaseModel):
    user_id: UUID4
    username: str
    conversion_rate: float


class UserAverageBookingTimeStat(BaseModel):
    user_id: UUID4
    username: str
    avg_booking_time: int


class StatAggregatedByUserResponse(BaseModel):
    user_booking_stats: list[UserBookingCountStat] = Field(default_factory=list)
    user_visit_stats: list[UserVisitCountStat] = Field(default_factory=list)
    user_place_bookings_stats: list[UserPlaceBookingCountStat] = Field(default_factory=list)
    conversion_rates: list[UserConversionRateStat] = Field(default_factory=list)
    average_booking_times: list[UserAverageBookingTimeStat] = Field(default_factory=list)


class PlaceVisitCountStat(BaseModel):
    place_id: UUID4
    place_name: str
    visit_count: int


class PlaceUserBookingCountStat(BaseModel):
    place_id: UUID4
    place_name: str
    users: list[UserBookingCountStat]


class PlaceConversionRateStat(BaseModel):
    place_id: UUID4
    place_name: str
    conversion_rate: float


class PlaceAverageBookingTimeStat(BaseModel):
    place_id: UUID4
    place_name: str
    avg_booking_time: int


class StatAggregatedByPlaceResponse(BaseModel):
    place_booking_stats: list[PlaceBookingCountStat] = Field(default_factory=list)
    place_visit_stats: list[PlaceVisitCountStat] = Field(default_factory=list)
    place_user_bookings_stats: list[PlaceUserBookingCountStat] = Field(default_factory=list)
    conversion_rates: list[PlaceConversionRateStat] = Field(default_factory=list)
    average_booking_times: list[PlaceAverageBookingTimeStat] = Field(default_factory=list)


class StatTotalResponse(BaseModel):
    total_bookings: int
    total_visits: int
    total_conversion_rate: float
    total_avg_booking_time: int
