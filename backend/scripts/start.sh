#!/bin/sh
set -eu

python -c 'import asyncio; from app.db.init_db import create_database_tables; from app.db.bootstrap import create_bootstrap_admin; asyncio.run(create_database_tables()); asyncio.run(create_bootstrap_admin())'
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
