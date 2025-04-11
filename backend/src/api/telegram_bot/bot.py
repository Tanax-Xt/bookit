import logging

import httpx

from src.config import settings


async def send_message(chat_id: int, text: str):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_API_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        if response.status_code != 200:
            logging.warning(f"Error: {response.status_code} - {response.text}")
        else:
            logging.info("Message sent successfully!")
