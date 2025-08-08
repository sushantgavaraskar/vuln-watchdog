# 🛡️ VulnWatchdog Backend API - Complete Documentation

## 📋 Overview
VulnWatchdog is a comprehensive vulnerability monitoring system that scans software dependencies for security vulnerabilities and provides real-time notifications. The backend provides a complete REST API with real-time SSE notifications, file upload capabilities, and role-based access control.

**Tech Stack**: Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, SSE, Nodemailer, Multer

## 🌐 Base Configuration
- **Base URL**: `https://vuln-watchdog-1.onrender.com/api`
- **Health Check**: `https://vuln-watchdog-1.onrender.com/health`
- **API Docs**: `https://vuln-watchdog-1.onrender.com/api/docs` (Swagger UI)

## 🔐 Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Database Schema

### User Model
```typescript
interface User {
  id: number;
  email: string;
  password: string; // hashed
  name: string;
  role: 'user' | 'admin';
  emailNotifications: boolean;
  dailyDigest: boolean;
  securityAlerts: boolean;
  alertFrequency: string; // 'immediate' | 'daily' | 'weekly'
  createdAt: Date;
}
```

### Project Model
```typescript
interface Project {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: Date;
  dependencies: Dependency[];
  collaborators: Collaborator[];
}
```

### Dependency Model
```typescript
interface Dependency {
  id: number;
  name: string;
  version: string;
  projectId: number;
  issues: Issue[];
}
```

### Issue Model
```typescript
interface Issue {
  id: number;
  title: string;
  description?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dependencyId: number;
  cveId?: string;
  createdAt: Date;
}
```

### Notification Model
```typescript
interface Notification {
  id: number;
  message: string;
  type: 'system' | 'security' | 'scan' | 'collaboration';
  metadata?: string; // JSON string
  read: boolean;
  userId: number;
  createdAt: Date;
}
```

## 🚀 API Endpoints

### 1. Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "emailNotifications": true,
    "dailyDigest": false,
    "securityAlerts": true,
    "alertFrequency": "immediate",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### POST `/api/auth/logout`
Logout user (client should delete token).

**Response:**
```json
{
  "status": "Logged out"
}
```

#### POST `/api/auth/forgot`
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "If that email exists, a reset link will be sent."
}
```

### 2. User Management (`/api/user`)

#### GET `/api/user/profile`
Get current user's profile and alert configuration.

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "emailNotifications": true,
  "dailyDigest": false,
  "securityAlerts": true,
  "alertFrequency": "immediate",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT `/api/user/profile`
Update user profile and alert configuration.

**Request Body:**
```json
{
  "name": "John Updated",
  "emailNotifications": false,
  "dailyDigest": true,
  "securityAlerts": true,
  "alertFrequency": "daily"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Updated",
    "role": "user",
    "emailNotifications": false,
    "dailyDigest": true,
    "securityAlerts": true,
    "alertFrequency": "daily",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Project Management (`/api/project`)

#### POST `/api/project`
Create a new project.

**Request Body:**
```json
{
  "name": "My React App",
  "description": "A modern React application with security monitoring"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "My React App",
  "description": "A modern React application with security monitoring",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/api/project`
Get all projects for the current user.

**Response:**
```json
[
  {
    "id": 1,
    "name": "My React App",
    "description": "A modern React application",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "dependencies": [
      {
        "id": 1,
        "name": "react",
        "version": "18.2.0",
        "issues": [
          {
            "id": 1,
            "title": "CVE-2023-1234",
            "severity": "HIGH",
            "cveId": "CVE-2023-1234"
          }
        ]
      }
    ]
  }
]
```

#### GET `/api/project/:id`
Get specific project details.

**Response:**
```json
{
  "id": 1,
  "name": "My React App",
  "description": "A modern React application",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "dependencies": [
    {
      "id": 1,
      "name": "react",
      "version": "18.2.0",
      "issues": [
        {
          "id": 1,
          "title": "CVE-2023-1234",
          "description": "Security vulnerability in React",
          "severity": "HIGH",
          "cveId": "CVE-2023-1234",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "collaborators": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "role": "member",
      "invitedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/project/:id/collaborator`
Add a collaborator to a project.

**Request Body:**
```json
{
  "email": "collaborator@example.com"
}
```

**Response:**
```json
{
  "message": "Collaborator added successfully",
  "collaborator": {
    "id": 1,
    "userId": 2,
    "projectId": 1,
    "role": "member",
    "invitedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/project/:id/export`
Export project report (PDF or CSV).

**Query Parameters:**
- `format`: `pdf` | `csv` (default: `pdf`)

**Response:** File download (PDF or CSV)

### 4. Vulnerability Scanning (`/api/scan`)

#### POST `/api/scan`
Upload dependency file and initiate vulnerability scan.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Dependency file (package.json, requirements.txt, pom.xml, etc.)
- `projectId`: Project ID to associate scan with

**Supported File Types:**
- `package.json` (Node.js)
- `requirements.txt` (Python)
- `pom.xml` (Java/Maven)
- `Gemfile` (Ruby)
- `composer.json` (PHP)
- `go.mod` (Go)

**Response:**
```json
{
  "totalDependencies": 15,
  "totalVulnerabilities": 3,
  "criticalVulnerabilities": 1,
  "scanDate": "2024-01-01T00:00:00.000Z",
  "results": [
    {
      "dependency": {
        "id": 1,
        "name": "react",
        "version": "18.2.0",
        "projectId": 1
      },
      "vulnerabilities": [
        {
          "title": "CVE-2023-1234",
          "description": "Security vulnerability in React",
          "severity": "HIGH",
          "cveId": "CVE-2023-1234"
        }
      ],
      "vulnerabilityCount": 1
    }
  ]
}
```

#### GET `/api/scan/:projectId`
Get scan results for a specific project.

**Response:**
```json
{
  "projectId": 1,
  "lastScan": "2024-01-01T00:00:00.000Z",
  "totalDependencies": 15,
  "totalVulnerabilities": 3,
  "criticalVulnerabilities": 1,
  "highVulnerabilities": 2,
  "mediumVulnerabilities": 0,
  "lowVulnerabilities": 0,
  "dependencies": [
    {
      "id": 1,
      "name": "react",
      "version": "18.2.0",
      "issues": [
        {
          "id": 1,
          "title": "CVE-2023-1234",
          "description": "Security vulnerability in React",
          "severity": "HIGH",
          "cveId": "CVE-2023-1234",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

#### GET `/api/scan/history/:projectId`
Get scan history for a project.

**Response:**
```json
[
  {
    "id": 1,
    "scanDate": "2024-01-01T00:00:00.000Z",
    "totalDependencies": 15,
    "totalVulnerabilities": 3,
    "criticalVulnerabilities": 1,
    "highVulnerabilities": 2,
    "mediumVulnerabilities": 0,
    "lowVulnerabilities": 0
  },
  {
    "id": 2,
    "scanDate": "2024-01-02T00:00:00.000Z",
    "totalDependencies": 16,
    "totalVulnerabilities": 2,
    "criticalVulnerabilities": 0,
    "highVulnerabilities": 2,
    "mediumVulnerabilities": 0,
    "lowVulnerabilities": 0
  }
]
```

### 5. Notifications (`/api/notifications`)

#### GET `/api/notifications`
Get paginated notifications.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Filter by type (`system` | `security` | `scan` | `collaboration`)

**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "message": "Critical vulnerability detected in React",
      "type": "security",
      "read": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "metadata": {
        "projectId": 1,
        "projectName": "My React App",
        "severity": "CRITICAL",
        "cveId": "CVE-2023-1234"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

#### GET `/api/notifications/stream`
Server-Sent Events stream for real-time notifications.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Accept: text/event-stream
Cache-Control: no-cache
```

**Event Types:**
- `connected`: Connection established
- `new_notification`: New notification received
- `unread_count`: Updated unread count
- `heartbeat`: Connection keep-alive

**Example SSE Events:**
```
data: {"type":"connected","message":"SSE connection established"}

data: {"type":"new_notification","notification":{"id":1,"message":"Critical vulnerability detected","type":"security"}}

data: {"type":"unread_count","count":5}

data: {"type":"heartbeat","timestamp":1704067200000}
```

#### POST `/api/notifications/read`
Mark a notification as read.

**Request Body:**
```json
{
  "notificationId": 1
}
```

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

#### POST `/api/notifications/read-all`
Mark all notifications as read.

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

#### GET `/api/notifications/unread-count`
Get unread notification count.

**Response:**
```json
{
  "count": 5
}
```

#### POST `/api/notifications/test`
Create a test notification.

**Request Body:**
```json
{
  "message": "This is a test notification",
  "type": "system"
}
```

**Response:**
```json
{
  "message": "Test notification created",
  "notification": {
    "id": 1,
    "message": "This is a test notification",
    "type": "system",
    "read": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Alerts Configuration (`/api/alerts`)

#### POST `/api/alerts/config`
Set user's alert configuration.

**Request Body:**
```json
{
  "emailNotifications": true,
  "dailyDigest": false,
  "securityAlerts": true,
  "alertFrequency": "immediate"
}
```

**Response:**
```json
{
  "message": "Alert configuration updated successfully"
}
```

#### POST `/api/alerts/test`
Send a test alert.

**Response:**
```json
{
  "message": "Test alert sent successfully"
}
```

### 7. Admin Endpoints (`/api/admin`)

*Requires admin role*

#### GET `/api/admin/users`
Get all users in the system.

**Response:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/admin/projects`
Get all projects in the system.

**Response:**
```json
[
  {
    "id": 1,
    "name": "My React App",
    "description": "A modern React application",
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "totalDependencies": 15,
    "totalVulnerabilities": 3
  }
]
```

#### GET `/api/admin/logs`
Get system audit logs.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "action": "project_created",
    "details": "Created project: My React App",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🔧 Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `413`: File Too Large
- `422`: Validation Error
- `429`: Rate Limited
- `500`: Internal Server Error

### Rate Limiting
- **Auth endpoints**: 5 requests per 15 minutes
- **Upload endpoints**: 10 requests per hour
- **General API**: 100 requests per 15 minutes

## 📁 File Upload

### Supported File Types
- **Node.js**: `package.json`, `package-lock.json`, `yarn.lock`
- **Python**: `requirements.txt`, `Pipfile`, `poetry.lock`
- **Java**: `pom.xml`, `build.gradle`
- **Ruby**: `Gemfile`, `Gemfile.lock`
- **PHP**: `composer.json`, `composer.lock`
- **Go**: `go.mod`, `go.sum`

### File Size Limits
- **Maximum file size**: 10MB
- **Supported formats**: JSON, TXT, XML, LOCK files

## 🔄 Real-time Features

### Server-Sent Events (SSE)
The backend provides real-time notifications using SSE:

```javascript
// Frontend implementation
const eventSource = new EventSource('/api/notifications/stream', {
  headers: { 'Authorization': `Bearer ${token}` }
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'new_notification':
      // Handle new notification
      showNotification(data.notification);
      break;
    case 'unread_count':
      // Update unread count badge
      updateUnreadCount(data.count);
      break;
    case 'heartbeat':
      // Connection is alive
      break;
  }
};
```

### Notification Types
- **system**: System notifications
- **security**: Security alerts and vulnerability notifications
- **scan**: Scan completion and results
- **collaboration**: Project collaboration events

## 🛡️ Security Features

### JWT Authentication
- Token-based authentication
- Automatic token validation
- Role-based access control

### Rate Limiting
- Prevents abuse and DDoS attacks
- Different limits for different endpoints

### File Upload Security
- File type validation
- File size limits
- Secure file handling

### CORS Configuration
- Configurable CORS settings
- Secure cross-origin requests

## 📊 Background Jobs

### Daily Scans
- Automatic vulnerability scanning
- Email notifications for critical issues
- Daily digest reports

### Alert Scheduling
- Configurable alert frequencies
- Email and in-app notifications
- Custom alert rules

## 🚀 Deployment

### Environment Variables
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
PORT=10000
```

### Health Checks
- `GET /health`: Basic health check
- `GET /api/health`: API health check with database connectivity

## 📈 Monitoring & Logging

### Audit Logs
- User actions tracking
- Security event logging
- Admin activity monitoring

### Error Logging
- Comprehensive error tracking
- Development and production logging
- Error reporting and monitoring

---

**This API provides a complete vulnerability monitoring solution with real-time notifications, comprehensive scanning capabilities, and robust security features.** 