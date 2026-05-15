# NexaFlow Server

Express and MongoDB backend for the NexaFlow project management workspace. It provides authentication, workspace hydration, projects, tasks, comments, team management, activities, notifications, and health checks for the React frontend in `../harmony-workspace`.

## Tech Stack

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- HttpOnly cookie sessions with `cookie-parser`
- bcrypt password hashing
- Zod request validation
- Helmet, CORS, rate limiting, and Morgan request logging

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexaflow_project_management
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8080,http://localhost:5173,https://your-frontend-domain.up.railway.app
NODE_ENV=production
AUTO_SEED=true
```

Start MongoDB locally, then run the API:

```bash
npm start
```

For development with reloads:

```bash
npm run dev
```

## Demo Data

When `AUTO_SEED=true`, the server creates demo users, projects, tasks, activities, and notifications if the database is empty.

Primary admin demo account:

```text
Email: alex@nexaflow.app
Password: demo1234
Role: admin
```

Member demo account:

```text
Email: jamie@nexaflow.app
Password: demo1234
Role: member
```

Other seeded members use the same temporary password: `demo1234`.

## RBAC Rules

Admins can create, update, and delete projects; create, update, and delete tasks; invite/remove team members; and change member roles.

Members can sign in, view their scoped workspace, comment on tasks, and update the status of tasks assigned to them. Members cannot create projects, create tasks, delete tasks, delete projects, invite users, remove users, or change roles.

Self-signups are created as members. Admin access comes from the seeded admin account or from an existing admin promoting a user through the Team endpoints.

## Health Checks

```bash
GET /api/health
GET /api/health/db
npm run health
```

Successful health responses return `status: "ok"` plus service or MongoDB connection details.

## Authentication Flow

### Signup

`POST /api/auth/signup`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "demo1234",
  "role": "admin"
}
```

The server validates the payload, hashes the password, stores the user, signs a JWT, stores it in the HttpOnly `nexaflow_auth` cookie, and returns the safe user object.

### Login

`POST /api/auth/login`

```json
{
  "email": "alex@nexaflow.app",
  "password": "demo1234"
}
```

The server verifies the password, sets the `nexaflow_auth` cookie, and returns the safe user object.

### Current User

`GET /api/auth/me`

Requires the `nexaflow_auth` cookie. The frontend sends it automatically with `credentials: "include"`.

### Logout

`POST /api/auth/logout`

Clears the auth cookie and returns `204 No Content`.

## Workspace Hydration

`GET /api/workspace`

Returns all data needed to render the app after login or refresh:

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

## Endpoint Map

### Projects

- `POST /api/projects` creates a project and records activity. Admin only.
- `PATCH /api/projects/:id` updates a project. Admin only.
- `DELETE /api/projects/:id` deletes a project, related tasks, and comments. Admin only.

### Tasks

- `POST /api/tasks` creates a task and records activity. Admin only.
- `PATCH /api/tasks/:id` updates a task. Admins can update all fields; members can only update `status` for tasks assigned to them. Status changes record movement activity.
- `DELETE /api/tasks/:id` deletes a task and comments. Admin only.
- `POST /api/tasks/:id/comments` adds a task comment and records activity.

### Team

- `POST /api/team/invite` creates a team member with a temporary password. Admin only.
- `PATCH /api/team/:id/role` updates a member role. Admin only.
- `DELETE /api/team/:id` removes a member. Admin only.

### Notifications

- `PATCH /api/notifications/:id/read` marks one notification as read.
- `PATCH /api/notifications/read-all` marks all visible notifications as read.

## Frontend Integration

The frontend expects:

```bash
VITE_API_URL=http://localhost:5000/api
```

For deployment, set the backend `CLIENT_URL` environment variable to the exact deployed frontend origin. For example:

```bash
CLIENT_URL=https://nexaflowwebclient-production.up.railway.app
NODE_ENV=production
```

Redeploy or restart the backend after changing hosting environment variables. Local `.env` changes do not affect an already deployed Render/Railway service.

The frontend does not store JWTs or users in `localStorage`. Auth lives in the server-created HttpOnly `nexaflow_auth` cookie. The frontend only stores the UI theme under `nexaflow:theme`.

## Data Models

- `User`: name, email, hashed password, role, avatar, and UI color. Password hashes are never returned.
- `Project`: metadata, status, priority, due date, owner, members, color, and display symbol.
- `Task`: project relationship, title, description, status, priority, assignee, and due date.
- `Comment`: task relationship, author, text, and creation time.
- `Activity`: user actions such as project creation, task creation, task movement, and comments.
- `Notification`: title, description, read state, type, and optional user ownership.

## Error Handling

Validation errors return `400` with field-level details. Duplicate records return `409`. Missing or invalid auth cookies return `401`. Admin-only authorization failures return `403`. Unknown routes return `404`.
