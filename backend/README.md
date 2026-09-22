# Portfolio CMS Backend

FastAPI backend for the custom portfolio CMS.

## Day 1 Scope

- FastAPI app setup.
- PostgreSQL database configuration.
- SQLAlchemy async engine and session dependency.
- Basic health endpoints.
- Project folder structure for future CMS modules.

## Setup

1. Create a virtual environment:

```bash
python3 -m venv .venv
```

2. Activate it:

```bash
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -e ".[dev]"
```

4. Copy environment variables:

```bash
cp .env.example .env
```

5. Update `DATABASE_URL` in `.env`.

6. Run the app:

```bash
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health` - app health check
- `GET /health/db` - database connectivity check

