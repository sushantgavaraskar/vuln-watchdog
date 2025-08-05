# 🛡️ VulnWatchdog Backend

A production-ready vulnerability monitoring and alerting system built with Node.js, Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **Vulnerability Scanning**: Automated CVE detection from dependency files
- **Real-time Notifications**: Server-Sent Events (SSE) for instant updates
- **Email Alerts**: Configurable email notifications with Gmail/SMTP support
- **User Management**: Role-based access control (RBAC)
- **Project Collaboration**: Team-based project management
- **Admin Dashboard**: System-wide analytics and monitoring
- **API Documentation**: Swagger/OpenAPI integration

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Real-time**: Server-Sent Events (SSE)
- **Email**: Nodemailer with SMTP
- **Documentation**: Swagger/OpenAPI

### Project Structure
```
server/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middlewares/      # Custom middleware
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── jobs/            # Background tasks
├── prisma/          # Database schema
└── uploads/         # File uploads (temporary)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Gmail account (for email notifications)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the server**
   ```bash
   npm run dev    # Development
   npm start      # Production
   ```

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

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
- `POST /scan` - Upload file and scan
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

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Email (SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password

# Optional
NODE_ENV=production
PORT=5000
```

### Email Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings → Security
   - Under "2-Step Verification" → "App passwords"
   - Select "Mail" and generate password
3. **Configure environment variables** with the generated password

## 📊 Database Schema

### Core Models
- **User**: Authentication and profile information
- **Project**: User projects with dependencies
- **Dependency**: Software packages with versions
- **Issue**: Vulnerability details and CVE information
- **Notification**: User notifications and alerts
- **Collaborator**: Project team members
- **AuditLog**: System activity tracking

## ⚡ Real-time Features

### Server-Sent Events (SSE)
Connect to `/api/notifications/stream` for real-time updates:

```javascript
const eventSource = new EventSource('/api/notifications/stream', {
  headers: { 'Authorization': `Bearer ${token}` }
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```

## 🚀 Production Deployment

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

## 📚 Documentation

- **API Documentation**: `http://localhost:5000/api/docs`
- **Backend Guide**: See `../backend.md` for comprehensive API documentation
- **Email Configuration**: See `PRODUCTION_EMAIL_CONFIG.md`

## 🧪 Testing

### Health Checks
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/health
```

### API Testing
```bash
# Test all endpoints
node testapi.js
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: User and admin roles
- **Rate Limiting**: Protection against abuse
- **Input Validation**: All inputs validated and sanitized
- **CORS Protection**: Configurable cross-origin requests
- **Security Headers**: Helmet.js for HTTP security headers

## 📈 Monitoring

### Logs
- Application logs in `logs/` directory
- Error tracking and debugging
- Performance monitoring

### Metrics
- API response times
- Database query performance
- Email delivery rates
- User activity tracking

## 🆘 Support

For issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check email configuration
5. Review API documentation

## 📄 License

This project is licensed under the MIT License.

---

**VulnWatchdog Backend is production-ready and fully documented!** 🎉 