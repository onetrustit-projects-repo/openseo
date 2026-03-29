# Team Collaboration and Role-Based Access

Multi-user support with RBAC for OpenSEO platform.

## Features

### Authentication
- JWT-based authentication
- SSO integration (Google, GitHub)
- Local email/password authentication

### Roles
- Admin: Full access
- Editor: Create and edit reports
- Viewer: Read-only access
- Customizable permissions

### Workspaces
- Shared workspaces for teams
- Member management
- Comment threads on audit findings
- Task assignment for SEO fixes

### Activity
- Activity logging
- Export to CSV
- Statistics and analytics

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/sso/google` - Google SSO
- `POST /api/auth/sso/github` - GitHub SSO
- `GET /api/auth/me` - Current user

### Users
- `GET /api/users` - List users
- `POST /api/users/invite` - Invite user

### Workspaces
- `GET /api/workspaces` - List workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id/comments` - Get comments
- `POST /api/workspaces/:id/comments` - Add comment
- `GET /api/workspaces/:id/tasks` - Get tasks
- `POST /api/workspaces/:id/tasks` - Create task

### RBAC
- `GET /api/rbac/roles` - List roles
- `GET /api/rbac/permissions` - List permissions
- `POST /api/rbac/check` - Check permission

### Activity
- `GET /api/activity` - Get activity log
- `POST /api/activity` - Log activity
- `GET /api/activity/stats` - Get statistics

## Quick Start

```bash
cd api && npm install && npm run dev
cd frontend && npm install && npm run dev
```

---

Task: bdbce432-855d-4e1c-a94e-725394e2e57b
