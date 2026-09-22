import argparse
import asyncio
from getpass import getpass

from sqlalchemy.exc import IntegrityError

from app.core.security import hash_password
from app.db.init_db import create_database_tables
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.repositories.users import get_user_by_username_or_email


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create the first CMS admin user.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--username", required=True)
    parser.add_argument("--full-name", default=None)
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    password = getpass("Password: ")
    password_confirmation = getpass("Confirm password: ")
    if password != password_confirmation:
        raise SystemExit("Passwords do not match.")
    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters long.")

    await create_database_tables()

    async with AsyncSessionLocal() as session:
        existing_user = await get_user_by_username_or_email(session, args.username)
        existing_email = await get_user_by_username_or_email(session, args.email)
        if existing_user or existing_email:
            raise SystemExit("An admin with that username or email already exists.")

        session.add(
            User(
                email=args.email,
                username=args.username,
                full_name=args.full_name,
                hashed_password=hash_password(password),
                is_active=True,
                is_superuser=True,
            )
        )
        try:
            await session.commit()
        except IntegrityError as exc:
            await session.rollback()
            message = "Could not create admin because username or email is not unique."
            raise SystemExit(message) from exc

    print(f"Created admin user: {args.username}")


if __name__ == "__main__":
    asyncio.run(main())
