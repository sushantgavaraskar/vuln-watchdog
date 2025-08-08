# VulnWatchdog Frontend

A modern, responsive frontend application for the VulnWatchdog vulnerability monitoring system, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: JWT-based authentication with role-based access control
- **Real-time Notifications**: Server-Sent Events (SSE) for live updates
- **File Upload**: Drag-and-drop dependency file upload with validation
- **Vulnerability Management**: Comprehensive vulnerability tracking and filtering
- **Admin Dashboard**: System administration and monitoring tools
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Real-time**: Server-Sent Events (SSE)
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # User dashboard pages
│   │   ├── upload/
│   │   ├── vulnerabilities/
│   │   └── profile/
│   ├── admin/             # Admin pages
│   │   ├── users/
│   │   ├── activity/
│   │   └── reports/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── AuthContext.tsx    # Authentication context
│   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   ├── FileUpload.tsx     # File upload component
│   ├── Header.tsx         # Application header
│   ├── Modal.tsx          # Modal component
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Toast.tsx          # Toast notifications
│   ├── VulnerabilityCard.tsx # Vulnerability display
│   ├── ReportViewer.tsx   # JSON report viewer
│   └── SSELogStream.tsx   # Real-time log stream
├── hooks/                 # Custom React hooks
│   └── useSSE.ts          # SSE connection hook
├── types/                 # TypeScript type definitions
│   └── index.ts           # All type definitions
└── utils/                 # Utility functions
    ├── api.ts             # API client and endpoints
    └── auth.ts            # Authentication utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vuln-watchdog/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://vuln-watchdog-1.onrender.com/api

# Optional: Custom configuration
NEXT_PUBLIC_APP_NAME=VulnWatchdog
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### API Endpoints

The frontend connects to the VulnWatchdog backend API. Ensure the backend is running and accessible at the configured URL.

## 📱 Pages & Features

### Authentication Pages
- **Login** (`/auth/login`): User authentication
- **Register** (`/auth/register`): New user registration

### User Dashboard
- **Dashboard** (`/dashboard`): Overview and statistics
- **Upload** (`/dashboard/upload`): Dependency file upload
- **Vulnerabilities** (`/dashboard/vulnerabilities`): Vulnerability management
- **Projects** (`/dashboard/projects`): Project management
- **Reports** (`/dashboard/reports`): Security reports
- **Profile** (`/dashboard/profile`): User profile settings

### Admin Dashboard
- **Admin Overview** (`/admin`): System statistics
- **Users** (`/admin/users`): User management
- **Activity** (`/admin/activity`): System activity logs
- **Reports** (`/admin/reports`): System reports

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email/password
2. **Login**: JWT token-based authentication
3. **Role-based Access**: User/admin role separation
4. **Session Management**: Automatic token refresh and logout
5. **Route Protection**: Protected routes with authentication checks

## 📤 File Upload

### Supported Formats
- **Node.js**: `package.json`, `package-lock.json`, `yarn.lock`
- **Python**: `requirements.txt`, `Pipfile`, `poetry.lock`
- **Java**: `pom.xml`, `build.gradle`
- **Ruby**: `Gemfile`, `Gemfile.lock`
- **PHP**: `composer.json`, `composer.lock`
- **Go**: `go.mod`, `go.sum`

### Upload Process
1. Select project from dropdown
2. Drag & drop or click to select file
3. File validation (type, size)
4. Upload with progress indicator
5. Scan results display

## 🔔 Real-time Features

### Server-Sent Events (SSE)
- **Notifications**: Real-time notification updates
- **Admin Logs**: Live system activity monitoring
- **Connection Management**: Automatic reconnection

### Notification System
- **In-app Notifications**: Toast notifications
- **Unread Count**: Badge indicators
- **Notification Types**: System, security, scan, collaboration

## 🎨 UI Components

### Core Components
- **AuthContext**: JWT authentication state management
- **DashboardLayout**: Layout wrapper with sidebar and header
- **FileUpload**: Drag-and-drop file upload with validation
- **VulnerabilityCard**: Expandable vulnerability details
- **Modal**: Reusable modal dialogs
- **Toast**: Notification system

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for theming
- **Accessibility**: ARIA labels and keyboard navigation

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (configured with ESLint)

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Setup

1. Set production environment variables
2. Configure API endpoints
3. Set up SSL certificates (if needed)
4. Configure reverse proxy (nginx, etc.)

### Docker Deployment

```bash
# Build Docker image
docker build -t vulnwatchdog-frontend .

# Run container
docker run -p 3000:3000 vulnwatchdog-frontend
```

## 🔧 API Integration

### Backend Requirements

The frontend expects the VulnWatchdog backend API to be running with the following endpoints:

- **Authentication**: `/api/auth/*`
- **Projects**: `/api/project/*`
- **Scans**: `/api/scan/*`
- **Vulnerabilities**: `/api/vulnerabilities/*`
- **Notifications**: `/api/notifications/*`
- **Admin**: `/api/admin/*`

### API Client

The `src/utils/api.ts` file contains all API endpoint definitions and Axios configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the backend logs

## 🔄 Updates

Stay updated with the latest changes:
- Follow the repository for updates
- Check the changelog
- Review release notes

---

**VulnWatchdog Frontend** - Secure dependency monitoring made simple.
