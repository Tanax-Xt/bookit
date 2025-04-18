"""add list

Revision ID: 2fd80b4b5d14
Revises:
Create Date: 2025-02-28 21:52:22.899500

"""

import uuid

import sqlalchemy as sa
from alembic import op

from src.security import get_password_hash

revision = "2fd80b4b5d14"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    places = op.create_table(
        "place",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("access_level", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    users = op.create_table(
        "user",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("username", sa.String(), nullable=False),
        sa.Column("password", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("secret_id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_user_username"), "user", ["username"], unique=True)
    op.create_table(
        "booking",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("place_id", sa.UUID(), nullable=False),
        sa.Column("start_date", sa.DateTime(), nullable=False),
        sa.Column("end_date", sa.DateTime(), nullable=False),
        sa.Column("is_activated_by_user", sa.Boolean(), nullable=False),
        sa.Column("notified_start", sa.Boolean(), nullable=False),
        sa.Column("notified_end", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["place_id"], ["place.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###

    roles = ["guest", "student", "admin"]
    ids = [
        "081cd80a-4ce4-41ab-ac2b-7c6e0ec200a9",
        "6b908b52-f4e0-4ce8-a8db-ee0e9609521e",
        "17f46520-1fce-4860-b447-13af49f2c09a",
    ]

    users_arr = [
        {
            "id": id,
            "username": role,
            "password": get_password_hash("H@rdP8ssw0rd"),
            "role": role,
            "secret_id": str(uuid.uuid4()),
        }
        for id, role in zip(ids, roles)
    ]

    users_experts = []
    for i in range(15):
        if i < 6:
            role = "guest"
            username = f"guest{i % 6 + 1}"
        elif i < 12:
            role = "student"
            username = f"student{i % 6 + 1}"
        else:
            role = "admin"
            username = f"admin{i % 6 + 1}"
        users_experts.append(
            {
                "id": str(uuid.uuid4()),
                "username": username,
                "password": get_password_hash("H@rdP8ssw0rd"),
                "role": role,
                "secret_id": str(uuid.uuid4()),
            }
        )

    op.bulk_insert(users, users_arr)

    op.bulk_insert(users, users_experts)

    op.bulk_insert(
        places,
        [
            {
                "id": "77f0161b-8dfb-4be6-81ce-9c200a426506",
                "name": "Студенческая переговорка",
                "type": "room",
                "capacity": 10,
                "access_level": "student",
            },
            {
                "id": "21f64010-560a-46ac-b8d4-aae36e1a9e26",
                "name": "Гостевая переговорка",
                "type": "room",
                "capacity": 8,
                "access_level": "guest",
            },
            {
                "id": "9c35ca25-7947-4fb4-ac4e-d17863671a30",
                "name": "Зал с пуфиками",
                "type": "room",
                "capacity": 15,
                "access_level": "student",
            },
            {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "name": "Стол 1",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "c8b70475-af22-4991-8d51-442ab164b1d9",
                "name": "Стол 2",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "a6abc93b-5c12-47b2-b1b4-01ba1ece6dda",
                "name": "Стол 3",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "3e41d3b6-822d-4518-ae7a-9ed0bdf39b0a",
                "name": "Стол 4",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "87b50544-4eda-491b-994a-aa6b6ea894ad",
                "name": "Стол 5",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "081cd80a-4ce4-41ab-ac2b-7c6e0ec200a9",
                "name": "Стол 6",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "1a3a020d-43f0-4ab9-a141-21de209d911e",
                "name": "Стол 7",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
            {
                "id": "d515176a-adad-4395-80d4-8b19ed47b6a1",
                "name": "Стол 8",
                "type": "seat",
                "capacity": 1,
                "access_level": "guest",
            },
        ],
    )


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("booking")
    op.drop_index(op.f("ix_user_username"), table_name="user")
    op.drop_table("user")
    op.drop_table("place")
    # ### end Alembic commands ###
