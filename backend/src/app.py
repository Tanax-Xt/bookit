from contextlib import asynccontextmanager

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from src.api import router
from src.api.scheduler.jobs import Jobs
from src.api.users.service import UserService
from src.config import settings
from src.db.deps import get_session
from src.limiter import limiter

instrumentator = Instrumentator()

scheduler = BackgroundScheduler()
session = next(get_session())
user_service = UserService(session=session)
jobs = Jobs(session=session, user_service=user_service)
# # Добавляем задачи в шедулер
# scheduler.add_job(jobs.delete_expired_bookings, "interval", minutes=5)
scheduler.add_job(jobs.notify_users_before_booking_start, "interval", minutes=1)
scheduler.add_job(jobs.notify_users_before_booking_end, "interval", minutes=1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    try:
        yield
    finally:
        scheduler.shutdown()


app = FastAPI(
    debug=settings.DEBUG,
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    swagger_ui_parameters=settings.SWAGGER_UI_PARAMETERS,
    lifespan=lifespan,  # Добавляем lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore

app.include_router(router)

app.state.limiter = limiter

instrumentator.instrument(app).expose(app)


@app.get("/", include_in_schema=False)
@limiter.limit(settings.API_RATE_LIMIT)
async def root(request: Request):
    return Response(status_code=status.HTTP_200_OK)
