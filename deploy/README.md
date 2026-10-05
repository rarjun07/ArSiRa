# Deployment Stack

This Compose file runs PostgreSQL, the FastAPI backend, and the React CMS admin panel together.

## Local or staging use

1. Copy `.env.example` to `.env` inside this directory.
2. Replace `POSTGRES_PASSWORD` and `SECRET_KEY` with real values.
3. Start the stack from this directory:

```bash
docker compose --env-file .env up --build -d
```

4. Create the first admin user:

```bash
docker compose --env-file .env exec backend python scripts/create_admin.py --email admin@example.com --username admin --full-name "Admin User"
```

The API is available at `http://localhost:8000`, the CMS is available at `http://localhost:8080`, and the public portfolio is available at `http://localhost:8081`.

For production, use managed PostgreSQL, HTTPS, a strong secret, a real frontend origin in `CORS_ORIGINS`, and object storage instead of the local upload volume.
