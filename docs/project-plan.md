# Portfolio Project With CMS - Adapted Plan

Source material: `Portfolio Project with CMS - Python.pdf`.

The PDF is treated as mentor-provided project requirements. Its examples mention Express, Flask, MongoDB, Supabase, and multer in places. For this project, we will use the user's chosen stack:

- React for frontend and CMS/admin UI
- FastAPI for backend CMS APIs
- PostgreSQL for the database

## Architecture

The project contains:

- Portfolio frontend that fetches dynamic content from the CMS backend.
- FastAPI backend that provides authentication, content APIs, upload APIs, and contact form APIs.
- Custom CMS/admin panel built from scratch.
- PostgreSQL database storing all content and messages.

## Content Areas

- Home
- About
- Projects
- Skills
- Experience / timeline
- Blog
- Contact
- Testimonials
- Services

## Backend APIs

Authentication:

- `POST /auth/login`
- `POST /auth/refresh`

Content:

- `/about` with `GET`, `PUT`
- `/skills` with `GET`, `POST`, `PUT`, `DELETE`
- `/projects` with `GET`, `POST`, `PUT`, `DELETE`
- `/blogs` with `GET`, `POST`, `PUT`, `DELETE`
- `/experience` CRUD
- `/testimonials` CRUD
- `/services` CRUD

Media:

- `POST /upload/image`

Contact:

- `POST /contact`

## Database Tables

- `users`
- `about`
- `skills`
- `projects`
- `blogs`
- `experience`
- `testimonials`
- `services`
- `messages`
- `media`

## Two-Week Plan

### Day 1 - Backend + Database Setup

- Initialize backend project.
- Configure FastAPI.
- Configure PostgreSQL connection.
- Create basic backend folder structure.
- Add health and database readiness endpoints.

### Day 2 - CMS Authentication System

- Create admin user model.
- Implement JWT login API.
- Add middleware/dependencies for protected routes.

### Day 3 - CMS Content Models

- Create models for About, Skills, Projects, Blogs, Experience, Testimonials, and Services.
- Build initial CRUD APIs.

### Day 4 - File Upload System

- Create file upload service for images.
- Add upload endpoint.
- Store media metadata in PostgreSQL.

### Day 5 - Admin Panel Setup

- Initialize React admin panel.
- Build login page.
- Build dashboard.

### Day 6 - CMS CRUD Screens

- Add admin pages for About, Skills, and Projects.

### Day 7 - Remaining CMS Pages

- Add admin pages for Blogs, Testimonials, Experience, and Services.
- Improve CMS UI.

### Day 8 - Portfolio Frontend Setup

- Initialize React portfolio frontend.
- Set up Tailwind CSS.
- Build layout and home page.

### Day 9 - Fetch Content From CMS

- Connect frontend to backend APIs.
- Display About, Skills, and Projects dynamically.

### Day 10 - Additional Sections

- Build Blog page.
- Build Testimonials section.
- Build Experience timeline.

### Day 11 - Contact Form

- Build contact form UI.
- Connect contact form to `POST /contact`.

### Day 12 - Backend + CMS Deployment

- Prepare backend for deployment.
- Configure environment variables.
- Deploy backend and admin panel.

### Day 13 - Portfolio Frontend Deployment

- Deploy portfolio frontend.
- Configure production API URLs and domain.

### Day 14 - Final Testing & Optimization

- Validate APIs.
- Optimize images.
- Run security checks.
- Polish UI and fix bugs.

