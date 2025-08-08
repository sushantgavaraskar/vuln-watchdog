# 🛡️ VulnWatchdog – Project Architecture & Design

> Automated Dependency Vulnerability Monitor

---

## 📁 Project Structure Overview

### 🧠 Summary

VulnWatchdog is a full-stack platform for automated monitoring of open-source dependency vulnerabilities. Users can upload dependency files (e.g., `package.json`, `requirements.txt`), trigger scans, receive alerts, and manage projects. The system is designed for extensibility, security, and real-world DevSecOps workflows.

---

## ⚙️ Backend (Node.js + Express + PostgreSQL + Prisma)

### 📂 Folder Structure

```
server/
├── controllers/         # Handle HTTP request logic
├── services/            # Business logic for scanning, alerts, etc.
├── routes/              # All REST API route definitions
├── middlewares/         # Auth, error handler, etc.
├── utils/               # Helpers (file parser, logger, version comparer)
├── jobs/                # Cron jobs (daily/weekly scanners)
├── prisma/              # Prisma schema and migrations
├── config/              # DB, env, API config
├── app.js               # Express app setup
├── server.js            # Entry point
└── package.json
```

### 📜 File & Folder Descriptions
- **controllers/**: Route handlers for auth, project, scan, alerts, admin, notifications
- **services/**: Business logic for auth, dependency analysis, scan orchestration, email, notifications
- **routes/**: REST API endpoints (auth, project, scan, alerts, notifications, admin, webhooks)
- **middlewares/**: JWT auth, error handler, rate limiter, admin check
- **utils/**: File parsing, CVE fetching, logging, version checking
- **jobs/**: Scheduled scans, alert dispatch, notification delivery
- **prisma/**: Database schema and migrations
- **config/**: DB connection, environment, external API keys

---

## 🧬 Prisma Schema (Database)

- **Users**: Auth, alert config, profile, role
- **Projects**: User projects
- **Dependencies**: Project dependencies
- **Issues**: Vulnerabilities per dependency
- **Notifications**: In-app notifications (NEW)
- **Collaborators**: Project team members (NEW)
- **AuditLogs**: Security/audit events (NEW)

---

## 📦 Backend Dependencies

```
npm i express prisma @prisma/client jsonwebtoken bcryptjs cors dotenv helmet
npm i node-cron nodemailer axios multer express-validator winston
```
Dev:
```
npm i -D nodemon
```

---

## 🔌 Backend API Routes Summary

| Method | Endpoint                       | Functionality                        |
| ------ | ------------------------------ | ------------------------------------ |
| POST   | `/api/auth/register`           | Register user                        |
| POST   | `/api/auth/login`              | Login & token                        |
| GET    | `/api/user/profile`            | Get user profile & alert config      |
| PUT    | `/api/user/profile`            | Update user profile & alert config   |
| GET    | `/api/project/`                | List projects                        |
| POST   | `/api/project/`                | Create new project                   |
| GET    | `/api/project/:id`             | Get project details                  |
| POST   | `/api/project/:id/collaborator`| Add collaborator to project (NEW)    |
| GET    | `/api/scan/history/:projectId` | Get scan history for project (NEW)   |
| POST   | `/api/scan/`                   | Submit deps file, initiate scan      |
| GET    | `/api/scan/:projectId`         | Get scan results                     |
| GET    | `/api/dependency/:id`          | Get dependency details (NEW)         |
| POST   | `/api/alerts/config`           | Set alert frequency/config           |
| GET    | `/api/alerts/test`             | Send test alert                      |
| GET    | `/api/notifications`           | List in-app notifications (NEW)      |
| POST   | `/api/notifications/read`      | Mark notification as read (NEW)      |
| GET    | `/api/admin/users`             | List all users (admin) (NEW)         |
| GET    | `/api/admin/projects`          | List all projects (admin) (NEW)      |
| GET    | `/api/admin/logs`              | Get audit logs (admin) (NEW)         |
| POST   | `/api/webhook/scan`            | Trigger scan via webhook (NEW)       |
| GET    | `/api/docs`                    | Swagger/OpenAPI docs (NEW)           |
| GET    | `/api/project/:id/export`      | Export project report (pdf/csv) (NEW)|

---

## 🖼️ Frontend (Next.js + Tailwind CSS + NextAuth.js)

### 📂 Folder Structure

```
client/
├── components/          # Reusable UI components
├── src/app/             # Next.js routing pages (auth, dashboard, project, api)
├── public/              # Static assets
├── styles/              # Tailwind + custom CSS
├── context/             # Auth/user state via React Context
├── hooks/               # Custom hooks (useProject, useScan)
├── tailwind.config.mjs
├── next.config.mjs
└── package.json
```

### 🧩 Key Components
- FileUploader: Drag & drop support
- DependencyTable: Display scanned results
- RiskBadge: Visual risk level
- ProjectCard: Overview of projects
- AlertForm: Alert config settings
- NotificationBell: In-app notifications (NEW)
- CollaboratorList: Project team (NEW)

### 📄 Key Pages
- `/` → Landing Page
- `/auth/login` / `/auth/register`
- `/dashboard` → User’s projects
- `/project/[id]` → Dependencies, risks, alerts, collaborators
- `/alerts` → Settings for alerts
- `/notifications` → In-app notifications (NEW)
- `/admin` → Admin dashboard (NEW)

---

## 📦 Frontend Dependencies

```
npm i next react react-dom tailwindcss@3.4.1 postcss autoprefixer
npm i axios next-auth react-hook-form zod
```
Dev:
```
npx tailwindcss init -p
```

---

## 🔐 Auth Summary (NextAuth.js)
- Google OAuth
- Credentials (email/password)
- JWT-based session stored client-side
- Protected backend routes with middleware
- Role-based access (admin/user)

---

## ✅ Requirements Summary
- [x] Tailwind CSS v3.4.x
- [x] Prisma + PostgreSQL
- [x] REST APIs with validations
- [x] Background jobs with `node-cron`
- [x] Alerts via email & in-app (NEW)
- [x] AI-based lightweight analysis (optional)
- [x] JWT Auth
- [x] Role-based access (admin/user)
- [x] Next.js routing (no React Router)
- [x] .jsx only (no .tsx)
- [x] Swagger/OpenAPI docs (NEW)
- [x] Multi-file type support (NEW)

---

## 🚀 Additional Features & Suggestions
- Admin dashboard (user/project management, system stats, audit logs)
- In-app notifications
- Multi-language support (i18n)
- More dependency file types (e.g., `pom.xml`, `Gemfile`, `composer.json`, `go.mod`)
- OAuth providers (GitHub, GitLab, Bitbucket)
- CI/CD integration for auto-scanning repos
- Advanced analytics (risk trends, charts)
- Accessibility and mobile polish
- API documentation (OpenAPI/Swagger)
- Production Dockerfile and deployment scripts
- Export scan results (PDF/CSV)
- Project collaborators
- Audit logging

---

## 🚀 Deployment (Docker Compose)

1. Fill in environment variables in `docker-compose.yml` and `server/.env`.
2. Build and start all services:

```sh
docker-compose up --build
```


---

## 📚 API Documentation

- Interactive API docs available at `/api/docs` (Swagger UI)
- See `backend.md` for detailed backend and API reference

---





