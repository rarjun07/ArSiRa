from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.message import Message
from app.models.user import User
from app.api.dependencies.auth import get_current_admin_user
from app.repositories.crud import create_record, get_record, list_records, update_record
from app.schemas.contact import ContactCreate, ContactResponse, MessageResponse

router = APIRouter(prefix="/contact", tags=["contact"])
SessionDep = Annotated[AsyncSession, Depends(get_db_session)]
AdminDep = Annotated[User, Depends(get_current_admin_user)]


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_message(payload: ContactCreate, session: SessionDep) -> ContactResponse:
    await create_record(session, Message, payload.model_dump())
    return ContactResponse(detail="Your message has been received. Thank you.")


@router.get("", response_model=list[MessageResponse])
async def list_contact_messages(session: SessionDep, _current_user: AdminDep) -> list[Message]:
    return await list_records(session, Message, order_by=Message.created_at.desc())


@router.patch("/{message_id}/read", response_model=MessageResponse)
async def mark_contact_message_read(
    message_id: int,
    session: SessionDep,
    _current_user: AdminDep,
) -> Message:
    message = await get_record(session, Message, message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message was not found.")
    return await update_record(session, message, {"is_read": True})
