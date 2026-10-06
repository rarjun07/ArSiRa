from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.repositories.users import get_user_by_username_or_email


async def create_bootstrap_admin() -> None:
    """Create the first admin from deployment secrets, without changing existing users."""
    email = settings.bootstrap_admin_email
    username = settings.bootstrap_admin_username
    password = settings.bootstrap_admin_password
    if not all((email, username, password)):
        return

    password_length = len(password.encode("utf-8"))
    if not 8 <= password_length <= 72:
        raise RuntimeError("BOOTSTRAP_ADMIN_PASSWORD must be between 8 and 72 bytes.")

    async with AsyncSessionLocal() as session:
        existing_user = await get_user_by_username_or_email(session, username)
        existing_email = await get_user_by_username_or_email(session, email)
        if existing_user or existing_email:
            return

        session.add(
            User(
                email=email,
                username=username,
                hashed_password=hash_password(password),
                is_active=True,
                is_superuser=True,
            )
        )
        try:
            await session.commit()
        except IntegrityError:
            await session.rollback()
