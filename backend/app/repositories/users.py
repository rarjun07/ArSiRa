from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    return await session.get(User, user_id)


async def get_user_by_username_or_email(
    session: AsyncSession,
    username_or_email: str,
) -> User | None:
    query = select(User).where(
        or_(
            User.username == username_or_email,
            User.email == username_or_email,
        )
    )
    result = await session.execute(query)
    return result.scalar_one_or_none()
