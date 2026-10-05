from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.message import Message
from app.repositories.crud import create_record
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter(prefix="/contact", tags=["contact"])
SessionDep = Annotated[AsyncSession, Depends(get_db_session)]


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_message(payload: ContactCreate, session: SessionDep) -> ContactResponse:
    await create_record(session, Message, payload.model_dump())
    return ContactResponse(detail="Your message has been received. Thank you.")
