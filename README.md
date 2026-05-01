# Harmony Server

Express and MongoDB backend for the Orbit project management frontend.

## Tech Stack

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- HttpOnly cookie sessions with `cookie-parser`
- bcrypt password hashing
- Zod request validation
- Helmet, CORS, rate limiting, and Morgan request logging

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/orbit_project_management
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8080
AUTO_SEED=true
```

3. Start MongoDB locally.

4. Start the API:

```bash
npm start
```

For development with reloads:

```bash
npm run dev
```

## Demo Account

When `AUTO_SEED=true`, the server creates demo users and project data if the database is empty.

- Email: `alex@orbit.app`
- Password: `demo1234`
- Role: `admin`

Invited members are also created with the temporary password `demo1234`.

## Health Checks

The server exposes health checks that verify both the API and MongoDB connection.

```bash
GET /api/health
GET /api/health/db
npm run health
```

Successful health responses return `status: "ok"` and MongoDB connection details.

## Authentication Flow

### Signup

`POST /api/auth/signup`

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "demo1234",
  "role": "admin"
}
```

The server validates the payload, hashes the password with bcrypt, stores the user in MongoDB, signs a JWT, stores it in an HttpOnly `orbit_auth` cookie, and returns:

```json
{
  "user": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin",
    "color": "from-violet-500 to-fuchsia-500"
  }
}
```

### Login

`POST /api/auth/login`

Body:

```json
{
  "email": "alex@orbit.app",
  "password": "demo1234"
}
```

The server fetches the user by email, compares the submitted password with the stored bcrypt hash, sets the HttpOnly `orbit_auth` cookie, then returns the user.

### Current User

`GET /api/auth/me`

Requires the `orbit_auth` cookie created by signup or login. The frontend sends it automatically with `credentials: "include"`.

All protected project management endpoints use the same auth cookie. Admin-only endpoints also check `req.user.role === "admin"`.

### Logout

`POST /api/auth/logout`

Clears the `orbit_auth` cookie and returns `204 No Content`.

## Workspace Hydration

`GET /api/workspace`

Returns all data needed by the frontend in one request:

```json
{
  "users": [],
  "projects": [],
  "tasks": [],
  "comments": [],
  "activities": [],
  "notifications": []
}
```

The React `AppContext` calls this after login/signup and on page refresh. If the auth cookie is missing or expired, the user is treated as logged out.

## Endpoint Map

### Projects

- `POST /api/projects` creates a project and records a "created project" activity.
- `PATCH /api/projects/:id` updates a project. Admin only.
- `DELETE /api/projects/:id` deletes a project, its tasks, and task comments. Admin only.

### Tasks

- `POST /api/tasks` creates a task and records a "created task" activity.
- `PATCH /api/tasks/:id` updates a task. Status changes record a movement activity.
- `DELETE /api/tasks/:id` deletes a task and its comments. Admin only.
- `POST /api/tasks/:id/comments` adds a comment and records activity.

### Team

- `POST /api/team/invite` creates a team member with a temporary password. Admin only.
- `PATCH /api/team/:id/role` updates a member role. Admin only.
- `DELETE /api/team/:id` removes a member. Admin only.

### Notifications

- `PATCH /api/notifications/:id/read` marks one notification as read.
- `PATCH /api/notifications/read-all` marks all visible notifications as read.

## Frontend Integration

The frontend defaults to:

```text
http://localhost:5000/api
```

Override it with a frontend `.env` value if needed:

```bash
VITE_API_URL=http://localhost:5000/api
```

The frontend does not store JWTs or users in `localStorage`. Auth is held in the server-created HttpOnly `orbit_auth` cookie. The only local storage value kept by the frontend is the UI theme as `orbit:theme`.

## Data Models

### User

Stores name, email, hashed password, role, avatar, and UI color. Password hashes are never returned in JSON responses.

### Project

Stores project metadata, status, priority, due date, owner, members, color, and display symbol.

### Task

Stores project relationship, title, description, status, priority, assignee, and due date.

### Comment

Stores task relationship, author, text, and creation time.

### Activity

Stores user actions such as creating projects, creating tasks, changing task status, and commenting.

### Notification

Stores notification title, description, read state, type, and optional user ownership.

## Error Handling

Validation errors return `400` with field-level details. Duplicate records return `409`. Missing or invalid auth cookies return `401`. Admin-only authorization failures return `403`. Unknown routes return `404`.
