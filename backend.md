# 🛡️ VulnWatchdog Backend API Documentation

## Overview
VulnWatchdog is a vulnerability monitoring system that scans software dependencies for security vulnerabilities and provides real-time notifications.

**Tech Stack**: Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, SSE, Nodemailer

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user  
- `POST /auth/logout` - Logout user
- `POST /auth/forgot` - Request password reset

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Projects
- `POST /project` - Create project
- `GET /project` - List user projects
- `GET /project/:id` - Get project details
- `POST /project/:id/collaborator` - Add collaborator
- `GET /project/:id/export` - Export project report

### Vulnerability Scanning
- `POST /scan` - Upload file and scan (multipart/form-data)
- `GET /scan/:projectId` - Get scan results
- `GET /scan/history/:projectId` - Get scan history

### Notifications
- `GET /notifications` - List notifications
- `POST /notifications/read` - Mark as read
- `POST /notifications/read-all` - Mark all as read
- `GET /notifications/unread-count` - Get unread count
- `GET /notifications/stream` - Real-time SSE stream

### Alerts
- `POST /alerts/config` - Set alert configuration
- `POST /alerts/test` - Send test alert

### Admin (Admin role required)
- `GET /admin/users` - List all users
- `GET /admin/projects` - List all projects
- `GET /admin/logs` - Get system logs

### System
- `GET /health` - Health check
- `GET /api/health` - API health check

## Request/Response Examples

### Register User
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Create Project
```json
POST /project
Headers: Authorization: Bearer TOKEN
{
  "name": "My React App",
  "description": "A modern React application"
}

Response:
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "name": "My React App",
    "description": "A modern React application",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Upload File and Scan
```javascript
POST /scan
Headers: Authorization: Bearer TOKEN
Content-Type: multipart/form-data

FormData:
- file: package.json (or requirements.txt, pom.xml, etc.)
- projectId: 1

Response:
{
  "success": true,
  "message": "Scan completed successfully",
  "results": [
    {
      "dependency": {
        "id": 1,
        "name": "react",
        "version": "18.2.0"
      },
      "vulnerabilities": [
        {
          "title": "CVE-2023-1234",
          "severity": "HIGH",
          "description": "Security vulnerability in React",
          "cveId": "CVE-2023-1234"
        }
      ],
      "vulnerabilityCount": 1
    }
  ],
  "summary": {
    "totalDependencies": 15,
    "totalVulnerabilities": 3,
    "criticalVulnerabilities": 1,
    "scanDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Notifications
```json
GET /notifications?page=1&limit=10
Headers: Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "message": "Critical vulnerability detected in React",
      "type": "security_alert",
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "metadata": {
        "projectId": 1,
        "projectName": "My React App",
        "severity": "HIGH"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## Real-time Notifications (SSE)

Connect to `/api/notifications/stream` for real-time updates:

```javascript
const eventSource = new EventSource('/api/notifications/stream', {
  headers: { 'Authorization': `Bearer ${token}` }
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'notification':
      // Handle new notification
      break;
    case 'unread_count':
      // Update unread count
      break;
  }
};
```

## Database Schema

### User
```sql
{
  id: Int (Primary Key)
  email: String (Unique)
  password: String (Hashed)
  name: String
  role: String (user|admin)
  emailNotifications: Boolean
  dailyDigest: Boolean
  securityAlerts: Boolean
  alertFrequency: String
  createdAt: DateTime
}
```

### Project
```sql
{
  id: Int (Primary Key)
  name: String
  description: String
  userId: Int (Foreign Key)
  createdAt: DateTime
}
```

### Dependency
```sql
{
  id: Int (Primary Key)
  name: String
  version: String
  projectId: Int (Foreign Key)
}
```

### Issue
```sql
{
  id: Int (Primary Key)
  title: String
  description: String
  severity: String (CRITICAL|HIGH|MEDIUM|LOW)
  dependencyId: Int (Foreign Key)
  cveId: String
  createdAt: DateTime
}
```

### Notification
```sql
{
  id: Int (Primary Key)
  message: String
  type: String
  metadata: String (JSON)
  read: Boolean
  userId: Int (Foreign Key)
  createdAt: DateTime
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 429: Rate Limited
- 500: Internal Server Error

## Frontend Integration Examples

### React Authentication Hook
```javascript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    }
    
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return { user, token, login, logout };
};
```

### API Client Hook
```javascript
const useApi = () => {
  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    });

    return response.json();
  };

  return { apiRequest };
};
```

### File Upload Component
```javascript
const FileUpload = ({ projectId, onComplete }) => {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const token = localStorage.getItem('token');
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      onComplete(data);
    }
  };

  return (
    <input
      type="file"
      accept=".json,.txt,.xml,.lock"
      onChange={(e) => handleUpload(e.target.files[0])}
    />
  );
};
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Optional
NODE_ENV=production
PORT=5000
```

## Production Deployment

### Docker
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

### PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'vulnwatchdog-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 5000 }
  }]
};
```

## API Documentation
- **Swagger UI**: `http://localhost:5000/api/docs`
- **Health Check**: `GET /health`

## Support
For issues: Check logs, verify environment variables, test database connectivity, review API documentation.

**Your VulnWatchdog backend is production-ready!** 🎉
