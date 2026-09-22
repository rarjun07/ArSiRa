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

## Create First Admin

After PostgreSQL is running and `.env` is configured:

```bash
python scripts/create_admin.py --email admin@example.com --username admin --full-name "Admin User"
```

## Endpoints

- `GET /health` - app health check
- `GET /health/db` - database connectivity check
- `POST /api/v1/auth/login` - admin login with username/email and password
- `POST /api/v1/auth/refresh` - refresh access token
- `GET /api/v1/auth/me` - protected current admin user check

## Day 2 Auth Notes

The first admin user can be created with `scripts/create_admin.py`. Passwords are stored with `hash_password()` from `app.core.security`, never in plain text.
