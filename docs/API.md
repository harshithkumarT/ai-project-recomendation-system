# API Documentation - AI Project Mentor

Base URL: `/api/v1`

## Auth

- `POST /auth/register`
  - Body: `{ "name": "John", "email": "john@mail.com", "password": "password123" }`
- `POST /auth/login`
  - Body: `{ "email": "john@mail.com", "password": "password123" }`
  - Returns `accessToken` and sets secure HTTP-only refresh cookie.
- `POST /auth/refresh`
  - Uses refresh cookie to issue a new access token.
- `POST /auth/logout`
  - Requires bearer token.

## Profile

- `GET /profile`
  - Requires bearer token.
- `PUT /profile`
  - Body:
  ```json
  {
    "skillLevel": "beginner",
    "goals": ["job", "freelance"],
    "techStack": ["React", "Node.js"],
    "completedProjects": ["Todo App"]
  }
  ```

## Recommendations

- `POST /recommend`
  - Requires bearer token.
  - Optional body (if profile exists):
  ```json
  {
    "skillLevel": "beginner",
    "goals": ["job"],
    "techStack": ["React", "Node.js"]
  }
  ```
- `GET /recommend?page=1&limit=20`

## Projects

- `GET /projects?page=1&limit=30`
- `POST /projects`
  - Body:
  ```json
  {
    "title": "AI Resume Builder",
    "description": "Build an ATS-friendly resume generator",
    "status": "todo",
    "progress": 0,
    "notes": "Start with auth and templates"
  }
  ```
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `POST /projects/:id/bookmark`
- `DELETE /projects/:id/bookmark`
- `GET /projects/bookmarks/list?page=1&limit=20`

## Admin (role=admin)

- `GET /admin/users?page=1&limit=50`
- `GET /admin/ai-usage`
- `GET /admin/prompt-template`
- `PUT /admin/prompt-template`
  - Body: `{ "template": "..." }`
