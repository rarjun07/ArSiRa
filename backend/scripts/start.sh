#!/bin/sh
set -eu

python -c 'import asyncio; from app.db.startup import initialize_database; asyncio.run(initialize_database())'
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
