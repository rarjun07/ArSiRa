from app.db.base import Base
from app.db.session import engine
from app.models import About, Blog, Experience, Media, Message, Project, Service, Skill, Testimonial, User

__all__ = [
    "About",
    "Blog",
    "Experience",
    "Media",
    "Message",
    "Project",
    "Service",
    "Skill",
    "Testimonial",
    "User",
    "create_database_tables",
]


async def create_database_tables() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
