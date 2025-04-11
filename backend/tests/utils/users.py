from random import randint
from typing import Any

VALID_USERNAME_1 = "johndoe"
VALID_USERNAME_2 = "johndoe2"
VALID_USERNAME_3 = "johndoe3"
VALID_PASSWORD_1 = "SupErHArdP@ssw0rd"
VALID_PASSWORD_2 = "SupErHArdP@ssw0rd2"


def are_usernames_matching(expected_usernames: list[str] | set[str], users_json: list[dict[str, Any]]) -> bool:
    expected_usernames_set = set(expected_usernames)
    actual_usernames_set = {user_json.get("username") for user_json in users_json}
    return expected_usernames_set == actual_usernames_set


def generate_random_valid_usernames(count: int = 10) -> set[str]:
    usernames: set[str] = set()
    while len(usernames) < count:
        usernames.add(generate_random_valid_username())
    return usernames


def generate_random_valid_username() -> str:
    return f"johndoe{randint(100, 1000)}"
