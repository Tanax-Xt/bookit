import uuid

from sqlalchemy.orm import Session

from src.api.places.models import Place
from tests.conftest import ENGINE


def create_places():
    with Session(ENGINE) as session:
        data = [
            {
                "id": uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                "name": "Стол 1",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": uuid.UUID("c8b70475-af22-4991-8d51-442ab164b1d9"),
                "name": "Стол 2",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": uuid.UUID("a6abc93b-5c12-47b2-b1b4-01ba1ece6dda"),
                "name": "Стол 3",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": uuid.UUID("3e41d3b6-822d-4518-ae7a-9ed0bdf39b0a"),
                "name": "Стол 4",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": uuid.UUID("87b50544-4eda-491b-994a-aa6b6ea894ad"),
                "name": "Стол 5",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": uuid.UUID("081cd80a-4ce4-41ab-ac2b-7c6e0ec200a9"),
                "name": "Стол 6",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
        ]
        places = []
        for d in data:
            place = Place(**d)
            places.append(place)
        session.add_all(places)
        session.commit()
