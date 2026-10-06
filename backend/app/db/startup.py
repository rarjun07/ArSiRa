from app.db.bootstrap import create_bootstrap_admin
from app.db.init_db import create_database_tables


async def initialize_database() -> None:
    """Initialize schema and optional bootstrap data on the same event loop."""
    await create_database_tables()
    await create_bootstrap_admin()
