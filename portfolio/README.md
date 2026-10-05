# Portfolio Website

Public React portfolio for the CMS project.

## Setup

```bash
npm install
npm run dev
```

The public site loads About, Skills, Projects, Blogs, Testimonials, and Experience from the FastAPI content APIs. Its contact form submits to `POST /api/v1/contact`. If the API is unavailable, it displays representative fallback content while preserving the page layout.

For a production container build, use the included Dockerfile. Set `VITE_API_BASE_URL` to the public HTTPS API URL at build time.
