# Portfolio CMS Project

This workspace follows the mentor PDF, adapted to this stack:

- Frontend: React
- Backend: FastAPI
- Database: PostgreSQL
- CMS: custom-built admin panel, API, and database

The admin panel lives in `frontend/` and connects to the FastAPI backend at `http://localhost:8000/api/v1` by default. The public portfolio lives in `portfolio/`.

## Day-by-Day Flow

Each day should be completed, tested, committed, and pushed before starting the next day.

Current status:

- Day 14: Final tests, builds, and optimization checks

## Two-Week Day-by-Day Plan

### Day 1 - Backend and Database Setup

- Initialize the FastAPI backend.
- Configure PostgreSQL and the backend folder structure.
- Add health and database-readiness endpoints.

### Day 2 - CMS Authentication

- Create the admin user model.
- Implement JWT login and refresh APIs.
- Protect CMS routes with authentication dependencies.

### Day 3 - CMS Content Models

- Create About, Skills, Projects, Blogs, Experience, Testimonials, and Services models.
- Add Pydantic schemas and initial CRUD APIs.

### Day 4 - File Upload System

- Build the image upload service and endpoint.
- Validate file size and MIME type.
- Store media metadata in PostgreSQL and serve uploaded files.

### Day 5 - Admin Panel Setup

- Initialize the React/Vite CMS panel.
- Build the login page, token persistence, logout, and dashboard.

### Day 6 - Core CMS CRUD Screens

- Build authenticated About, Skills, and Projects editors.
- Support create, update, delete, and About upsert workflows.

### Day 7 - Remaining CMS Screens

- Build Blogs, Testimonials, Experience, and Services editors.
- Add publish state, dates, highlights, tags, and list management.

### Day 8 - Portfolio Frontend Setup

- Initialize the separate React portfolio app.
- Configure Tailwind CSS and the responsive layout.
- Build the home, work, About, Skills, and Contact sections.

### Day 9 - Dynamic CMS Content

- Connect the portfolio to the public backend APIs.
- Render About, Skills, and Projects dynamically.
- Add loading states and fallback content.

### Day 10 - Additional Portfolio Sections

- Add the Journal/Blog section.
- Add Testimonials and the Experience timeline.
- Connect each section to CMS content with responsive layouts.

### Day 11 - Contact Form

- Build the contact form UI and validation.
- Connect it to `POST /api/v1/contact`.
- Store submitted messages in PostgreSQL.

### Day 12 - Backend and CMS Deployment

- Prepare FastAPI and CMS production Dockerfiles.
- Configure environment variables and Compose orchestration.
- Add PostgreSQL health checks and persistent uploads.

### Day 13 - Portfolio Deployment

- Prepare the portfolio production Dockerfile and Nginx SPA serving.
- Configure the production API URL, CORS, and deployment settings.

### Day 14 - Final Testing and Optimization

- Validate backend APIs and run automated tests.
- Run Ruff, compilation checks, and security checks.
- Build both React applications for production.
- Review deployment configuration, clean dependencies, and polish UI bugs.

See `docs/project-plan.md` for the full adapted plan.

## Deploy On Render

The repository includes `render.yaml` for a Render Blueprint with four resources:

- Render PostgreSQL database: `portfolio-cms-db`
- FastAPI API: `portfolio-cms-api`
- React CMS admin panel: `portfolio-cms-admin`
- React public portfolio: `portfolio-cms-site`

To deploy:

1. Push the repository to GitHub.
2. In Render, choose **New > Blueprint** and select this repository.
3. Review the resources and enter the generated admin credentials when prompted.
4. Apply the Blueprint and wait for the database, API, CMS, and portfolio builds to finish.
5. Create the first admin user from the API service shell:

```bash
python scripts/create_admin.py --email admin@example.com --username admin --full-name "Arjun Singh"
```

The Blueprint uses the default `*.onrender.com` service URLs. If you add custom domains, update `CORS_ORIGINS`, `PUBLIC_UPLOAD_BASE_URL`, and both frontend `VITE_API_BASE_URL` values in Render, then redeploy.
