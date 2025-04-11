import asyncio
import logging

import requests

from src.config import settings

from aiogram import Bot, Dispatcher, Router
from aiogram.filters import CommandStart
from aiogram.types import Message


router = Router()


@router.message(CommandStart)
async def start(message: Message):
    words = message.text.split()
    if len(words) != 2:
        await message.answer(
            "Некорректный формат сообщения, для авторизации перейдите не сайт"
        )
        return
    user_id = words[1]
    response = requests.get(
        f"{settings.BACKEND_URL}/users/{user_id}",
    )
    if response.status_code != 200:
        await message.answer("Пользователь не найден.")
        return
    if response.json().get("telegram_id") is not None:
        await message.answer("Вы уже привязали свой аккаунт к телеграм боту!")
        return
    response = requests.post(
        f"{settings.BACKEND_URL}/users/attach-tg",
        json={"user_id": user_id, "telegram_id": message.from_user.id},
    )
    if response.status_code != 204:
        await message.answer("Ошибка привязки аккаунта")
    else:
        await message.answer("Вы успешно привязали свой аккаунт к телеграм боту!")


logging.info(settings.TELEGRAM_BOT_API_TOKEN)
bot = Bot(token=settings.TELEGRAM_BOT_API_TOKEN)


def run_bot():
    dispatcher = Dispatcher()
    dispatcher.include_router(router)
    asyncio.run(dispatcher.start_polling(bot))


if __name__ == "__main__":
    run_bot()
