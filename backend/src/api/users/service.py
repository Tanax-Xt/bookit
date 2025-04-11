import uuid
from uuid import UUID

from src.api.params import SearchParams
from src.api.users.models import User
from src.api.users.schemas import UserRegistrationRequest
from src.db.deps import SessionDepends
from src.security import get_password_hash


class UserService:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_user_by_username(self, username: str) -> User | None:
        return self.session.query(User).filter(User.username == username).first()

    def get_user_by_id(self, user_id: UUID) -> User | None:
        return self.session.get(User, user_id)

    def get_users(self, search_params: SearchParams) -> list[User]:
        query = self.session.query(User)

        if search_params.q:
            query = query.filter(User.username.icontains(search_params.q))

        return query.order_by(User.username).offset(search_params.offset).limit(search_params.limit).all()

    def register_user(self, args: UserRegistrationRequest) -> User:
        user = User(
            username=args.username,
            password=get_password_hash(args.password),
            role=args.role,
        )

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def update_username(self, user: User, new_username: str) -> None:
        user.username = new_username

        self.session.commit()
        self.session.refresh(user)

    def update_password(self, user: User, new_password: str) -> None:
        hashed_password = get_password_hash(password=new_password)
        user.password = hashed_password

        self.session.commit()
        self.session.refresh(user)

    def update_role(self, user: User, new_role: str) -> None:
        user.role = new_role

        self.session.commit()
        self.session.refresh(user)

    def update_secret_id(self, user: User) -> None:
        user.secret_id = str(uuid.uuid4())

        self.session.commit()
        self.session.refresh(user)

    def update_name(self, user: User, name: str):
        user.name = name

        self.session.commit()
        self.session.refresh(user)

    def update_email(self, user: User, email: str):
        user.email = email

        self.session.commit()
        self.session.refresh(user)

    @staticmethod
    def check_secret(user: User, secret_id: str) -> bool:
        if user.secret_id != secret_id:
            return False
        return True

    def set_telegram_id(self, user: User, telegram_id: int):
        user.telegram_id = telegram_id
        self.session.commit()
        self.session.refresh(user)
