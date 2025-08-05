# VulnWatchdog Backend Documentation

## Overview
VulnWatchdog is an automated dependency vulnerability monitoring system with a comprehensive REST API backend built with Node.js, Express, PostgreSQL, and Prisma ORM.

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Background Jobs**: node-cron
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs, helmet, rate limiting

### Project Structure
```
server/
├── config/           # Database and environment configuration
├── controllers/      # Request handlers
├── middlewares/      # Authentication, authorization, error handling
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── jobs/            # Background job schedulers
├── prisma/          # Database schema and migrations
├── uploads/         # File upload storage
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── package.json     # Dependencies
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  "id": 1,           // User ID
  "role": "admin",   // User role (user/admin)
  "iat": 1234567890  // Issued at timestamp
}
```

### Authentication Flow
1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Use Token**: Include in Authorization header: `Bearer <token>`

### User Roles
- **user**: Regular user with project management and scanning capabilities
- **admin**: Full system access including user management and audit logs

## 📊 Database Schema

### Core Models

#### User
```javascript
{
  id: 1,
  email: "user@example.com",
  password: "hashed_password",
  name: "John Doe",
  role: "user", // "user" or "admin"
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

#### Project
```javascript
{
  id: 1,
  name: "My Project",
  description: "Project description",
  userId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

#### Dependency
```javascript
{
  id: 1,
  name: "axios",
  version: "^1.0.0",
  projectId: 1,
  createdAt: "2024-01-01T00:00:00Z"
}
```

#### Issue
```javascript
{
  id: 1,
  dependencyId: 1,
  severity: "HIGH", // LOW, MEDIUM, HIGH, CRITICAL
  title: "Vulnerability Title",
  description: "Vulnerability description",
  cveId: "CVE-2024-1234",
  createdAt: "2024-01-01T00:00:00Z"
}
```

## 🚀 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**
```javascript
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/auth/forgot
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### User Management

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "emailNotifications": true,
  "dailyDigest": false,
  "securityAlerts": true,
  "alertFrequency": "immediate"
}
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "emailNotifications": false,
  "dailyDigest": true,
  "securityAlerts": true,
  "alertFrequency": "daily"
}
```

### Project Management

#### Create Project
```http
POST /api/project
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

**Response:**
```javascript
{
  "id": 1,
  "name": "My Project",
  "description": "Project description",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### List Projects
```http
GET /api/project
Authorization: Bearer <token>
```

**Response:**
```javascript
[
  {
    "id": 1,
    "name": "My Project",
    "description": "Project description",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Project Details
```http
GET /api/project/:id
Authorization: Bearer <token>
```

#### Add Collaborator
```http
POST /api/project/:id/collaborator
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "collaborator@example.com"
}
```

#### Export Project
```http
GET /api/project/:id/export
Authorization: Bearer <token>
```

### Scanning

#### Upload and Scan File
```http
POST /api/scan
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <dependency_file>
- projectId: 1
```

**Supported Files:**
- `package.json` (Node.js)
- `requirements.txt` (Python)
- `pom.xml` (Java/Maven)
- `Gemfile` (Ruby)
- `composer.json` (PHP)
- `go.mod` (Go)

**Response:**
```javascript
{
  "results": [
    {
      "dependency": "axios",
      "version": "^1.0.0",
      "vulnerabilities": [
        {
          "severity": "HIGH",
          "title": "Vulnerability Title",
          "description": "Description",
          "cveId": "CVE-2024-1234"
        }
      ]
    }
  ]
}
```

#### Get Scan Results
```http
GET /api/scan/:projectId
Authorization: Bearer <token>
```

#### Get Scan History
```http
GET /api/scan/history/:projectId
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "history": [
    {
      "id": 1,
      "projectId": 1,
      "scanDate": "2024-01-01T00:00:00Z",
      "totalDependencies": 10,
      "vulnerabilitiesFound": 3
    }
  ]
}
```

### Alerts & Notifications

#### Set Alert Configuration
```http
POST /api/alerts/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "dailyDigest": false,
  "securityAlerts": true,
  "alertFrequency": "immediate"
}
```

#### Send Test Alert
```http
GET /api/alerts/test
Authorization: Bearer <token>
```

#### List Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

**Response:**
```javascript
[
  {
    "id": 1,
    "message": "New vulnerability found in axios@^1.0.0",
    "read": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Mark Notification as Read
```http
POST /api/notifications/read
Authorization: Bearer <token>
Content-Type: application/json

{
  "notificationId": 1
}
```

### Admin Endpoints

#### List All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### List All Projects (Admin Only)
```http
GET /api/admin/projects
Authorization: Bearer <admin_token>
```

#### Get Audit Logs (Admin Only)
```http
GET /api/admin/logs
Authorization: Bearer <admin_token>
```

## 🔧 Frontend Integration Guide

### Setup

1. **Install Dependencies**
```bash
npm install axios react-router-dom @tanstack/react-query
```

2. **Configure API Client**
```javascript
// api/client.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Authentication Hooks

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, role } = response.data;
      
      localStorage.setItem('authToken', token);
      setUser({ email, role });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const response = await apiClient.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, login, register, logout };
};
```

### Project Management Hooks

```javascript
// hooks/useProjects.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get('/project').then(res => res.data),
  });

  const createProject = useMutation({
    mutationFn: (projectData) => apiClient.post('/project', projectData),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });

  const getProject = (id) => useQuery({
    queryKey: ['project', id],
    queryFn: () => apiClient.get(`/project/${id}`).then(res => res.data),
    enabled: !!id,
  });

  return { projects, isLoading, createProject, getProject };
};
```

### Scanning Hooks

```javascript
// hooks/useScan.js
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useScan = (projectId) => {
  const scanFile = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      return apiClient.post('/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });

  const { data: scanResults } = useQuery({
    queryKey: ['scan-results', projectId],
    queryFn: () => apiClient.get(`/scan/${projectId}`).then(res => res.data),
    enabled: !!projectId,
  });

  const { data: scanHistory } = useQuery({
    queryKey: ['scan-history', projectId],
    queryFn: () => apiClient.get(`/scan/history/${projectId}`).then(res => res.data),
    enabled: !!projectId,
  });

  return { scanFile, scanResults, scanHistory };
};
```

### React Components Example

```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      // Redirect to dashboard
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

```jsx
// components/ProjectList.jsx
import { useProjects } from '../hooks/useProjects';

export const ProjectList = () => {
  const { projects, isLoading, createProject } = useProjects();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Projects</h2>
      {projects?.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🚀 Deployment

### Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
SNYK_TOKEN=your_snyk_api_token
PORT=5000
HOST=localhost
```

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Role-based access control (RBAC)
- Audit logging for admin actions

## 📈 Performance

- Database connection pooling
- File upload streaming
- Background job processing
- Caching for scan results
- Optimized database queries

## 🐛 Error Handling

All API endpoints return consistent error responses:
```javascript
{
  "error": "Error message",
  "status": 400
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (e.g., user already exists)
- `500`: Internal Server Error

## 📚 API Documentation

Interactive API documentation is available at:
```
http://localhost:5000/api/docs
```

This provides a Swagger UI interface for testing all endpoints directly from the browser.