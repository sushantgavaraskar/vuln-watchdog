# VulnWatchdog Backend

A comprehensive REST API backend for automated dependency vulnerability monitoring, built with Node.js, Express, PostgreSQL, and Prisma ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vulnwatchdog/server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

Interactive API documentation is available at:
```
http://localhost:5000/api/docs
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Email Configuration (for alerts)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# External APIs
SNYK_TOKEN=your_snyk_api_token

# Server Configuration
PORT=5000
HOST=localhost
```

## 🏗️ Project Structure

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

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Use Token**: Include in Authorization header: `Bearer <token>`

### User Roles
- **user**: Regular user with project management and scanning capabilities
- **admin**: Full system access including user management and audit logs

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and profile information
- **Project**: User projects and metadata
- **Dependency**: Package dependencies with versions
- **Issue**: Vulnerability information linked to dependencies
- **Notification**: In-app notifications for users
- **AuditLog**: System audit trail for admin actions

## 🔍 Supported File Types

The scanning system supports multiple dependency file formats:

- `package.json` (Node.js)
- `requirements.txt` (Python)
- `pom.xml` (Java/Maven)
- `Gemfile` (Ruby)
- `composer.json` (PHP)
- `go.mod` (Go)

## 🚀 Available Scripts

```bash
# Start the server
npm start

# Development mode with auto-reload
npm run dev

# Database operations
npm run db:migrate    # Run database migrations
npm run db:generate   # Generate Prisma client
npm run db:studio     # Open Prisma Studio

# Testing
npm test
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

## 🚀 Deployment

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

### Production Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npm run db:migrate`
4. Start server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open an issue in the repository or contact the maintainer.

---

For detailed API documentation and frontend integration guide, see `backend.md`. 