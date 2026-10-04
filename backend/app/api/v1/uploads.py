from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.auth import get_current_admin_user
from app.core.config import settings
from app.db.session import get_db_session
from app.models.media import Media
from app.models.user import User
from app.repositories.crud import create_record
from app.schemas.media import MediaResponse
from app.services.uploads import save_image

router = APIRouter(tags=["media"])

SessionDep = Annotated[AsyncSession, Depends(get_db_session)]
AdminDep = Annotated[User, Depends(get_current_admin_user)]


@router.post("/upload/image", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: Annotated[UploadFile, File(...)],
    session: SessionDep,
    _current_user: AdminDep,
) -> Media:
    stored_name, storage_path, file_size = await save_image(file)
    public_url = f"{settings.public_upload_base_url.rstrip('/')}/{stored_name}"
    return await create_record(
        session,
        Media,
        {
            "file_name": stored_name,
            "original_name": file.filename or stored_name,
            "content_type": file.content_type or "application/octet-stream",
            "file_size": file_size,
            "storage_path": storage_path,
            "public_url": public_url,
        },
    )
