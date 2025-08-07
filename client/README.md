# VulnWatchdog Frontend

A modern, enterprise-grade vulnerability scanning and management application built with React, TypeScript, and Vite.

## 🚀 Features

### Core Functionality
- **Vulnerability Scanning** - Upload dependency files and get comprehensive security analysis
- **Project Management** - Organize and monitor security projects
- **Real-time Notifications** - Live updates via Server-Sent Events (SSE)
- **Admin Dashboard** - Complete system administration and monitoring
- **User Management** - Role-based access control and user administration
- **Audit Logging** - Complete system activity tracking

### Advanced Features
- **Cross-Project Analysis** - Aggregate vulnerabilities across all projects
- **Advanced Filtering** - Multi-dimensional search and filter capabilities
- **Export Functionality** - Generate comprehensive security reports
- **Real-time Monitoring** - Live system health and performance tracking
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠 Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with comprehensive type definitions
- **Vite** - Fast build tool and development server

### State Management & Data Fetching
- **@tanstack/react-query** - Powerful data fetching and caching
- **React Context** - Global state management for authentication

### UI Components
- **shadcn/ui** - Modern, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### Real-time Features
- **Server-Sent Events (SSE)** - Real-time notifications and updates
- **WebSocket-like functionality** - Live data synchronization

### File Handling
- **react-dropzone** - Drag-and-drop file uploads
- **File validation** - Comprehensive file type and size validation

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Vitest** - Fast unit testing framework
- **Testing Library** - Component testing utilities

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   ├── auth/           # Authentication components
│   │   ├── scanning/       # File upload and scanning
│   │   └── admin/          # Admin-specific components
│   ├── hooks/              # Custom React hooks
│   │   ├── use-auth.tsx    # Authentication context
│   │   ├── use-api.ts      # React Query hooks
│   │   └── use-notifications-realtime.ts # SSE hook
│   ├── lib/                # Utility libraries
│   │   ├── api-client.ts   # API client
│   │   └── utils.ts        # Utility functions
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Projects.tsx    # Project management
│   │   ├── Scan.tsx        # Vulnerability scanning
│   │   ├── Vulnerabilities.tsx # Vulnerability analysis
│   │   ├── AdminDashboard.tsx # Admin panel
│   │   └── ...             # Other pages
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # All application types
│   └── tests/              # Test files
│       └── setup.ts        # Test configuration
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vuln-watchdog/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:10000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8081`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🧪 Testing

### Running Tests
```bash
npm run test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

### Test Structure
- **Unit Tests** - Individual component and function tests
- **Integration Tests** - API integration and data flow tests
- **E2E Tests** - End-to-end user workflow tests

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:10000/api` |

### Vite Configuration

The application uses Vite for fast development and optimized builds:

- **Hot Module Replacement (HMR)** - Instant updates during development
- **Code Splitting** - Automatic bundle optimization
- **TypeScript Support** - Native TypeScript compilation
- **CSS Processing** - PostCSS with Tailwind CSS

### Tailwind CSS

Custom Tailwind configuration with:
- **Custom color palette** - Brand-specific colors
- **Component variants** - Custom component styles
- **Responsive utilities** - Mobile-first design approach

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach** - Optimized for mobile devices
- **Tablet support** - Intermediate breakpoints
- **Desktop optimization** - Full-featured desktop experience
- **Touch-friendly** - Optimized for touch interactions

## 🔐 Security Features

### Authentication
- **JWT Tokens** - Secure authentication
- **Protected Routes** - Role-based access control
- **Auto-logout** - Session management
- **CSRF Protection** - Cross-site request forgery prevention

### Data Protection
- **Input Validation** - Client-side validation
- **XSS Prevention** - Content Security Policy
- **Secure Headers** - Security-focused HTTP headers
- **File Upload Security** - Validated file uploads

## 🎨 UI/UX Design

### Design System
- **Consistent Components** - Unified design language
- **Accessibility** - WCAG 2.1 AA compliance
- **Dark/Light Mode** - Theme support
- **Loading States** - Smooth user experience

### User Experience
- **Intuitive Navigation** - Clear information architecture
- **Real-time Feedback** - Immediate user feedback
- **Error Handling** - Graceful error management
- **Performance** - Optimized for speed

## 🔄 Real-time Features

### Server-Sent Events (SSE)
- **Live Notifications** - Real-time security alerts
- **Connection Management** - Automatic reconnection
- **Event Processing** - Efficient event handling
- **State Synchronization** - Live data updates

### WebSocket-like Functionality
- **Bidirectional Communication** - Real-time data flow
- **Connection Health** - Connection status monitoring
- **Event Broadcasting** - System-wide notifications

## 📊 Performance Optimization

### Code Splitting
- **Route-based Splitting** - Lazy-loaded pages
- **Component Splitting** - Dynamic imports
- **Vendor Splitting** - Optimized bundle sizes

### Caching Strategy
- **React Query Caching** - Intelligent data caching
- **Browser Caching** - Static asset caching
- **Memory Management** - Efficient memory usage

### Bundle Optimization
- **Tree Shaking** - Unused code elimination
- **Minification** - Compressed bundle sizes
- **Gzip Compression** - Reduced transfer sizes

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting** - Netlify, Vercel, GitHub Pages
- **CDN** - CloudFlare, AWS CloudFront
- **Container** - Docker deployment
- **Server** - Traditional web server

### Environment Setup
1. Set production environment variables
2. Configure API endpoints
3. Set up monitoring and logging
4. Configure SSL certificates

## 🔧 Development

### Code Style
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Conventional Commits** - Git commit standards

### Git Workflow
1. **Feature Branches** - Isolated development
2. **Pull Requests** - Code review process
3. **Automated Testing** - CI/CD pipeline
4. **Deployment** - Automated deployment

### Debugging
- **React DevTools** - Component debugging
- **Network Tab** - API debugging
- **Console Logging** - Development logging
- **Error Boundaries** - Error handling

## 📚 API Integration

### API Client
The application uses a centralized API client (`src/lib/api-client.ts`) that provides:
- **Type-safe API calls** - Full TypeScript support
- **Error handling** - Consistent error management
- **Authentication** - Automatic token management
- **Request/Response interceptors** - Middleware functionality

### Endpoints
- **Authentication** - Login, register, logout
- **User Management** - Profile, settings, preferences
- **Project Management** - CRUD operations
- **Vulnerability Scanning** - File upload and analysis
- **Notifications** - Real-time alerts
- **Admin Functions** - System administration

## 🎯 Roadmap

### Planned Features
- [ ] **Advanced Analytics** - Detailed security metrics
- [ ] **Team Collaboration** - Multi-user project management
- [ ] **Integration APIs** - Third-party integrations
- [ ] **Mobile App** - Native mobile application
- [ ] **Advanced Reporting** - Custom report generation

### Performance Improvements
- [ ] **Service Workers** - Offline functionality
- [ ] **Progressive Web App** - PWA features
- [ ] **Advanced Caching** - Intelligent caching strategies
- [ ] **Bundle Optimization** - Further size reduction

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Maintain accessibility standards
- Document new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- **API Documentation** - Complete API reference
- **Component Library** - UI component documentation
- **User Guide** - End-user documentation

### Getting Help
- **Issues** - GitHub issues for bug reports
- **Discussions** - GitHub discussions for questions
- **Documentation** - Comprehensive documentation
- **Community** - Developer community support

---

**VulnWatchdog Frontend** - Secure, modern, and powerful vulnerability management for the modern web.
