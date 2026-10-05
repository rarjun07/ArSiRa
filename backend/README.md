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
- `POST /api/v1/upload/image` - protected image upload
- `POST /api/v1/contact` - public contact message submission
- `POST /api/v1/auth/login` - admin login with username/email and password
- `POST /api/v1/auth/refresh` - refresh access token
- `GET /api/v1/auth/me` - protected current admin user check
- `GET`, `PUT /api/v1/about` - portfolio about content
- `GET`, `POST /api/v1/skills` - skill records
- `GET`, `PUT`, `DELETE /api/v1/skills/{skill_id}` - single skill record
- `GET`, `POST /api/v1/projects` - project records
- `GET`, `PUT`, `DELETE /api/v1/projects/{project_id}` - single project record
- `GET`, `POST /api/v1/blogs` - blog records
- `GET`, `PUT`, `DELETE /api/v1/blogs/{blog_id}` - single blog record
- `GET`, `POST /api/v1/experience` - experience records
- `GET`, `PUT`, `DELETE /api/v1/experience/{experience_id}` - single experience record
- `GET`, `POST /api/v1/testimonials` - testimonial records
- `GET`, `PUT`, `DELETE /api/v1/testimonials/{testimonial_id}` - single testimonial
- `GET`, `POST /api/v1/services` - service records
- `GET`, `PUT`, `DELETE /api/v1/services/{service_id}` - single service record

## Day 2 Auth Notes

The first admin user can be created with `scripts/create_admin.py`. Passwords are stored with `hash_password()` from `app.core.security`, never in plain text.

## Day 3 Content Notes

Content `GET` routes are public so the portfolio frontend can read them. Create, update, and delete routes require a bearer access token from the admin login flow.

## Verification

```bash
pytest
ruff check app scripts
```
