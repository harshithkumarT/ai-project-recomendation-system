# AI Project Mentor (PERN SaaS)

Production-ready full-stack SaaS app for personalized AI project recommendations, roadmaps, and project tracking.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express (ES modules)
- Database: PostgreSQL (Local)
- Auth: JWT access token + refresh token cookie + bcrypt
- AI: OpenAI-compatible API

## Project Structure

- `backend/` Express API, MVC architecture, PostgreSQL access
- `frontend/` React SPA with protected routes and responsive UI
- `backend/sql/schema.sql` database schema
- `docs/API.md` endpoint docs

## Backend Highlights

- API versioning via `/api/v1`
- MVC folders: routes, controllers, services, models
- Security: `helmet`, strict CORS, rate limiting, HTTP-only cookies
- Auth: register/login/logout/refresh, role-based authorization
- Validation: Zod for body/query/params
- DB safety: parameterized SQL queries with `pg` pooling
- Admin: user listing, AI usage monitoring, prompt-template management

## Frontend Highlights

- Folder architecture: `components/`, `pages/`, `hooks/`, `services/`
- Auth context + Axios interceptors with refresh token flow
- Pages: Login, Signup, Dashboard, Recommendations, Project Tracker, Admin
- Lazy loaded routes for performance
- Mobile-first responsive glassmorphism UI

## Setup Instructions

## 1) Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally

## 2) Database Setup

Create a local database named `ai-recommendation-system`, then run schema:

```sql
-- execute file
backend/sql/schema.sql
```

## 3) Backend Setup

```bash
cd backend
cp .env.example .env
# update env values
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

## 4) Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Variables

### backend/.env

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `FRONTEND_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

### frontend/.env

- `VITE_API_URL`

## Deployment

### Backend (Render/Railway)

- Deploy `backend/`
- Set build command: `npm install`
- Set start command: `npm start`
- Add all backend env vars securely in platform secrets.

### Frontend (Vercel/Netlify)

- Deploy `frontend/`
- Build command: `npm run build`
- Output dir: `dist`
- Add `VITE_API_URL` to frontend env settings.

### Database (Local PostgreSQL)

- Ensure PostgreSQL is running on localhost:5432
- Create database `ai-recommendation-system`
- Use this connection string in backend `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai-recommendation-system
```
- Execute `backend/sql/schema.sql` on your local PostgreSQL instance

## Security Notes

- Passwords are hashed with bcrypt.
- Refresh token is stored in secure HTTP-only cookie.
- Access token has short TTL and is rotated via refresh endpoint.
- Input validation and role checks enforced at route level.
- SQL injection mitigated with parameterized queries.

## Suggested Next Enhancements

- Add Redis caching for recommendation list endpoints.
- Add integration tests (Jest + Supertest).
- Add CI pipeline (lint/build/test).
- Add email verification and password reset flow.
