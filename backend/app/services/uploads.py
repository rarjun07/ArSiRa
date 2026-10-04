from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_IMAGE_SIZE = 5 * 1024 * 1024


def upload_directory() -> Path:
    directory = Path(settings.upload_dir)
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def validate_image(file: UploadFile) -> str:
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type or "")
    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, WebP, and GIF images are supported.",
        )
    return extension


async def save_image(file: UploadFile) -> tuple[str, str, int]:
    extension = validate_image(file)
    stored_name = f"{uuid4().hex}{extension}"
    destination = upload_directory() / stored_name
    total_size = 0

    try:
        with destination.open("wb") as output:
            while chunk := await file.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > MAX_IMAGE_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Image size must not exceed 5 MB.",
                    )
                output.write(chunk)
    except Exception:
        destination.unlink(missing_ok=True)
        raise
    finally:
        await file.close()

    return stored_name, str(destination), total_size
