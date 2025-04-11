import os
from typing import Iterator

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from src.app import app
from src.config import settings
from src.db.deps import get_session
from src.db.models import Base
from tests.utils.auth import login_user, register_user

ENGINE = create_engine(os.getenv("DATABASE_URL", str(settings.POSTGRES_TEST_URI)))


def get_test_session() -> Iterator[Session]:
    session = Session(ENGINE)

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@pytest.fixture(scope="class", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=ENGINE)
    Base.metadata.create_all(bind=ENGINE)


@pytest.fixture
def auth_guest_client(client: TestClient):
    token = register_user(client, "unique_username", "H@rdP8ssw0rd")
    if token.status_code == status.HTTP_409_CONFLICT:
        token = login_user(client, "unique_username", "H@rdP8ssw0rd")
    token = token.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest.fixture
def auth_admin_client(client: TestClient):
    token = register_user(client, "admin_username", "H@rdP8ssw0rd", "admin")
    if token.status_code == status.HTTP_409_CONFLICT:
        token = login_user(client, "admin_username", "H@rdP8ssw0rd")
    token = token.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest.fixture(scope="function")
def client():
    return TestClient(app)


app.dependency_overrides[get_session] = get_test_session
