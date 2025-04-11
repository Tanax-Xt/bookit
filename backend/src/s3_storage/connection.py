from typing import TYPE_CHECKING

from boto3.session import Session

from src.config import settings

if TYPE_CHECKING:
    from types_boto3_s3 import S3Client


def get_s3_connection() -> S3Client:
    session = Session()

    s3 = session.client(  # type: ignore
        service_name="s3",
        endpoint_url=settings.YANDEX_S3_ENDPOINT_URL,
        aws_access_key_id=settings.YANDEX_S3_KEY_ID,
        aws_secret_access_key=settings.YANDEX_S3_KEY,
    )

    return s3  # type: ignore
