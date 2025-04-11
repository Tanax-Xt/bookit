import uuid
from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest

from src.api.users.models import User
from src.api.users.schemas import UserRegistrationRequest
from src.api.users.service import UserService


@pytest.fixture
def dummy_session():
    return MagicMock()


@pytest.fixture
def service(dummy_session):
    return UserService(session=dummy_session)


class DummyUser:
    def __init__(
        self, username="test", password="pass", role="guest", secret_id=None, name=None, email=None, telegram_id=None
    ):
        self.id = uuid.uuid4()
        self.username = username
        self.password = password
        self.role = role
        self.secret_id = secret_id or str(uuid.uuid4())
        self.name = name
        self.email = email
        self.telegram_id = telegram_id
        self.created_at = datetime.now()
        self.updated_at = datetime.now()


def test_get_user_by_username(service, dummy_session):
    dummy_user = DummyUser(username="john_doe")
    # mock chain: session.query(User).filter(...).first() returns dummy_user
    mock_query = MagicMock()
    dummy_session.query.return_value = mock_query
    mock_query.filter.return_value.first.return_value = dummy_user

    result = service.get_user_by_username("john_doe")
    dummy_session.query.assert_called_once_with(User)
    mock_query.filter.assert_called_once()
    assert result == dummy_user


def test_get_user_by_id(service, dummy_session):
    dummy_user = DummyUser()
    dummy_session.get.return_value = dummy_user
    result = service.get_user_by_id(dummy_user.id)
    dummy_session.get.assert_called_once_with(User, dummy_user.id)
    assert result == dummy_user


@patch("src.api.users.service.get_password_hash", return_value="hashed_password")
def test_register_user(mock_hash, service, dummy_session):
    reg_request = UserRegistrationRequest(username="alice", password="H@rdP8ssw0rd", role="guest")
    # simulate commit and refresh behavior by setting side_effect: refresh returns None.
    dummy_session.add.return_value = None
    dummy_session.commit.return_value = None
    dummy_session.refresh.side_effect = lambda user: None

    user = service.register_user(reg_request)
    # Check that the password is hashed.
    assert user.username == "alice"
    assert user.password == "hashed_password"
    assert user.role == "guest"
    dummy_session.add.assert_called_once_with(user)
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(user)


@patch("src.api.users.service.get_password_hash", return_value="new_hashed_password")
def test_update_password(mock_hash, service, dummy_session):
    dummy_user = DummyUser(password="old_pass")
    service.update_password(dummy_user, "new_password")
    assert dummy_user.password == "new_hashed_password"
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)


def test_update_username(service, dummy_session):
    dummy_user = DummyUser(username="old_username")
    service.update_username(dummy_user, "new_username")
    assert dummy_user.username == "new_username"
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)


def test_update_role(service, dummy_session):
    dummy_user = DummyUser(role="guest")
    service.update_role(dummy_user, "admin")
    assert dummy_user.role == "admin"
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)


def test_update_secret_id(service, dummy_session):
    dummy_user = DummyUser(secret_id="old_secret")
    service.update_secret_id(dummy_user)

    assert dummy_user.secret_id != "old_secret"

    uuid_obj = uuid.UUID(dummy_user.secret_id)
    assert isinstance(uuid_obj, uuid.UUID)
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)


def test_update_name(service, dummy_session):
    dummy_user = DummyUser(name="Old Name")
    service.update_name(dummy_user, "New Name")
    assert dummy_user.name == "New Name"
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)


def test_update_email(service, dummy_session):
    dummy_user = DummyUser(email="old@example.com")
    service.update_email(dummy_user, "new@example.com")
    assert dummy_user.email == "new@example.com"
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)


def test_check_secret_success(service):
    dummy_user = DummyUser(secret_id="secret_value")
    assert service.check_secret(dummy_user, "secret_value") is True


def test_check_secret_failure(service):
    dummy_user = DummyUser(secret_id="secret_value")
    assert service.check_secret(dummy_user, "wrong_secret") is False


def test_set_telegram_id(service, dummy_session):
    dummy_user = DummyUser(telegram_id=None)
    service.set_telegram_id(dummy_user, 123456)
    assert dummy_user.telegram_id == 123456
    dummy_session.commit.assert_called()
    dummy_session.refresh.assert_called_with(dummy_user)
