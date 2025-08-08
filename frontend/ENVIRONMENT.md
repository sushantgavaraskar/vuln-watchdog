# Environment Configuration Guide

This document explains how to configure environment variables for the VulnWatchdog frontend application.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` according to your setup

3. Validate your configuration:
   ```bash
   npm run validate-env
   ```

## Environment Variables

### Required Variables

These variables must be set for the application to function properly:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `https://vuln-watchdog-1.onrender.com/api` |
| `NEXT_PUBLIC_JWT_STORAGE_KEY` | Key for storing JWT tokens in localStorage | `vulnwatchdog_token` |
| `NEXT_PUBLIC_USER_STORAGE_KEY` | Key for storing user data in localStorage | `vulnwatchdog_user` |

### API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `https://vuln-watchdog-1.onrender.com/api` | ✅ |
| `NEXT_PUBLIC_API_HEALTH_CHECK` | Health check endpoint | `https://vuln-watchdog-1.onrender.com/health` | ❌ |
| `NEXT_PUBLIC_API_DOCS` | API documentation URL | `https://vuln-watchdog-1.onrender.com/api/docs` | ❌ |

### Application Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `VulnWatchdog` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Application description | `Comprehensive vulnerability monitoring system` |

### Development Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node.js environment | `development` |
| `NEXT_PUBLIC_DEV_MODE` | Enable development mode | `true` |
| `NEXT_PUBLIC_ENABLE_DEBUG_MODE` | Enable debug logging | `false` |

### Authentication Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_JWT_STORAGE_KEY` | localStorage key for JWT tokens | `vulnwatchdog_token` |
| `NEXT_PUBLIC_USER_STORAGE_KEY` | localStorage key for user data | `vulnwatchdog_user` |
| `NEXT_PUBLIC_TOKEN_EXPIRY_BUFFER` | Token expiry buffer (ms) | `300000` (5 min) |

### File Upload Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Maximum file size in bytes | `10485760` (10MB) |
| `NEXT_PUBLIC_ALLOWED_FILE_TYPES` | Comma-separated list of allowed file types | See default value below |

**Default Allowed File Types:**
```
package.json,package-lock.json,yarn.lock,pnpm-lock.yaml,requirements.txt,Pipfile,Pipfile.lock,poetry.lock,composer.json,composer.lock,go.mod,go.sum,Cargo.toml,Cargo.lock,Gemfile,Gemfile.lock,mix.exs,mix.lock
```

### SSE (Server-Sent Events) Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SSE_RECONNECT_INTERVAL` | Reconnection interval (ms) | `5000` |
| `NEXT_PUBLIC_SSE_MAX_RECONNECT_ATTEMPTS` | Maximum reconnection attempts | `5` |
| `NEXT_PUBLIC_SSE_ENDPOINTS_NOTIFICATIONS` | Notifications SSE endpoint | `/notifications/stream` |
| `NEXT_PUBLIC_SSE_ENDPOINTS_ADMIN_LOGS` | Admin logs SSE endpoint | `/admin/sse` |

### UI Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_TOAST_DURATION` | Toast notification duration (ms) | `4000` |
| `NEXT_PUBLIC_MODAL_ANIMATION_DURATION` | Modal animation duration (ms) | `200` |
| `NEXT_PUBLIC_PAGINATION_DEFAULT_SIZE` | Default pagination size | `10` |
| `NEXT_PUBLIC_SEARCH_DEBOUNCE_DELAY` | Search debounce delay (ms) | `300` |

### Error Handling Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `NEXT_PUBLIC_RETRY_ATTEMPTS` | Number of retry attempts | `3` |
| `NEXT_PUBLIC_RETRY_DELAY` | Delay between retries (ms) | `1000` |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_SSE` | Enable Server-Sent Events | `true` |
| `NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES` | Enable real-time updates | `true` |
| `NEXT_PUBLIC_ENABLE_FILE_UPLOAD` | Enable file upload functionality | `true` |
| `NEXT_PUBLIC_ENABLE_ADMIN_FEATURES` | Enable admin features | `true` |
| `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` | Enable notifications | `true` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` |
| `NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN` | Enable social login | `false` |
| `NEXT_PUBLIC_ENABLE_MOCK_API` | Enable mock API for testing | `false` |

### Analytics and Monitoring (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics service ID | `` |

### External Services (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN` | Enable social login | `false` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | `` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth client ID | `` |

### Security Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_CSRF_PROTECTION` | Enable CSRF protection | `true` |
| `NEXT_PUBLIC_ENABLE_CONTENT_SECURITY_POLICY` | Enable CSP | `true` |
| `NEXT_PUBLIC_ENABLE_XSS_PROTECTION` | Enable XSS protection | `true` |

### Performance Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_CACHE` | Enable caching | `true` |
| `NEXT_PUBLIC_CACHE_DURATION` | Cache duration (ms) | `300000` |
| `NEXT_PUBLIC_ENABLE_LAZY_LOADING` | Enable lazy loading | `true` |
| `NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION` | Enable image optimization | `true` |

### Testing Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_MOCK_API` | Enable mock API | `false` |
| `NEXT_PUBLIC_MOCK_API_DELAY` | Mock API response delay (ms) | `1000` |
| `NEXT_PUBLIC_ENABLE_DEBUG_MODE` | Enable debug mode | `false` |

## Environment-Specific Configurations

### Development Environment

```bash
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

### Production Environment

```bash
NODE_ENV=production
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_MOCK_API=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Testing Environment

```bash
NODE_ENV=test
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_MOCK_API=true
NEXT_PUBLIC_MOCK_API_DELAY=100
```

## Validation

The application includes a validation script that checks your environment configuration:

```bash
# Run validation
npm run validate-env

# Validation is also run automatically during dev and build
npm run dev
npm run build
```

The validation script checks:
- Required variables are set
- API URLs are valid
- Numeric values are within acceptable ranges
- File type arrays are properly formatted
- Development vs production settings are appropriate

## Troubleshooting

### Common Issues

1. **Missing API Base URL**
   - Error: `NEXT_PUBLIC_API_BASE_URL is required`
   - Solution: Set the correct backend API URL

2. **Invalid API URL Format**
   - Error: `NEXT_PUBLIC_API_BASE_URL must be a valid HTTP/HTTPS URL`
   - Solution: Ensure the URL starts with `http://` or `https://`

3. **File Size Too Small**
   - Error: `NEXT_PUBLIC_MAX_FILE_SIZE must be greater than 0`
   - Solution: Set a reasonable file size limit (e.g., `10485760` for 10MB)

4. **No Allowed File Types**
   - Error: `NEXT_PUBLIC_ALLOWED_FILE_TYPES must contain at least one file type`
   - Solution: Add at least one file type to the comma-separated list

### Development vs Production Warnings

The validation script will warn you if you have development settings enabled in production:

- `NEXT_PUBLIC_DEV_MODE should be false in production`
- `NEXT_PUBLIC_ENABLE_DEBUG_MODE should be false in production`
- `NEXT_PUBLIC_ENABLE_MOCK_API should be false in production`

### API Testing

Use the built-in API tester to verify connectivity:

1. Navigate to `/api-test` in your application
2. Click "Run All Tests" to test all endpoints
3. Review the results and recommendations

## Security Considerations

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use different values for different environments** - Don't use production values in development
3. **Rotate sensitive values regularly** - Especially API keys and tokens
4. **Use HTTPS in production** - Always use secure connections for API calls
5. **Validate all inputs** - The application validates environment variables on startup

## Best Practices

1. **Use descriptive variable names** - Make it clear what each variable does
2. **Group related variables** - Keep similar settings together
3. **Document your changes** - Update this file when adding new variables
4. **Test your configuration** - Always run validation after changes
5. **Use environment-specific files** - Consider `.env.development`, `.env.production` for different environments

## API Testing

The application includes a comprehensive API testing tool that can be accessed at `/api-test`. This tool:

- Tests all backend endpoints
- Validates authentication requirements
- Measures response times
- Provides detailed error information
- Gives recommendations for fixing issues

Use this tool to verify that your frontend can properly communicate with the backend API.
