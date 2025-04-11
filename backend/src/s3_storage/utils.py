import logging
from typing import List

from src.s3_storage.connection import get_s3_connection


def upload_to_s3(file_path: str, bucket_name: str, prefix: str) -> bool:
    try:
        s3 = get_s3_connection()
        key = f"{prefix}/{file_path.split('/')[-1]}"
        s3.upload_file(file_path, bucket_name, key)
        return True
    except Exception as e:
        logging.error("Error uploading file to S3: %s", e)
        return False


def download_from_s3(bucket_name: str, key: str, download_path: str) -> bool:
    try:
        s3 = get_s3_connection()
        s3.download_file(bucket_name, key, download_path)
        return True
    except Exception as e:
        logging.error("Error downloading file from S3: %s", e)
        return False


def list_files_with_prefix(bucket_name: str, prefix: str) -> List[str]:
    try:
        s3 = get_s3_connection()
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

        contents = response.get("Contents", [])
        files = [item.get("Key", "") for item in contents]
        return [file for file in files if file]
    except Exception as e:
        logging.error("Error listing files: %s", e)
        return []
