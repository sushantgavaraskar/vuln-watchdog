// Configuration utility for environment variables
// This file provides type-safe access to environment variables with validation

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vuln-watchdog-1.onrender.com/api',
    healthCheck: process.env.NEXT_PUBLIC_API_HEALTH_CHECK || 'https://vuln-watchdog-1.onrender.com/health',
    docs: process.env.NEXT_PUBLIC_API_DOCS || 'https://vuln-watchdog-1.onrender.com/api/docs',
  },

  // Application Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'VulnWatchdog',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Comprehensive vulnerability monitoring system',
  },

  // Development Configuration
  dev: {
    mode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
    debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  },

  // Authentication Configuration
  auth: {
    jwtStorageKey: process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'vulnwatchdog_token',
    userStorageKey: process.env.NEXT_PUBLIC_USER_STORAGE_KEY || 'vulnwatchdog_user',
    tokenExpiryBuffer: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY_BUFFER || '300000'),
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'),
    allowedFileTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || '').split(',').filter(Boolean),
  },

  // SSE Configuration
  sse: {
    reconnectInterval: parseInt(process.env.NEXT_PUBLIC_SSE_RECONNECT_INTERVAL || '5000'),
    maxReconnectAttempts: parseInt(process.env.NEXT_PUBLIC_SSE_MAX_RECONNECT_ATTEMPTS || '5'),
    endpoints: {
      notifications: process.env.NEXT_PUBLIC_SSE_ENDPOINTS_NOTIFICATIONS || '/notifications/stream',
      adminLogs: process.env.NEXT_PUBLIC_SSE_ENDPOINTS_ADMIN_LOGS || '/admin/sse',
    },
  },

  // UI Configuration
  ui: {
    toastDuration: parseInt(process.env.NEXT_PUBLIC_TOAST_DURATION || '4000'),
    modalAnimationDuration: parseInt(process.env.NEXT_PUBLIC_MODAL_ANIMATION_DURATION || '200'),
    paginationDefaultSize: parseInt(process.env.NEXT_PUBLIC_PAGINATION_DEFAULT_SIZE || '10'),
    searchDebounceDelay: parseInt(process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE_DELAY || '300'),
  },

  // Error Handling Configuration
  error: {
    apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY || '1000'),
  },

  // Feature Flags
  features: {
    sse: process.env.NEXT_PUBLIC_ENABLE_SSE !== 'false',
    realTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES !== 'false',
    fileUpload: process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOAD !== 'false',
    adminFeatures: process.env.NEXT_PUBLIC_ENABLE_ADMIN_FEATURES !== 'false',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    socialLogin: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
    mockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
  },

  // Analytics and Monitoring
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    id: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
  },

  // External Services
  external: {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
  },

  // Security Configuration
  security: {
    csrfProtection: process.env.NEXT_PUBLIC_ENABLE_CSRF_PROTECTION !== 'false',
    contentSecurityPolicy: process.env.NEXT_PUBLIC_ENABLE_CONTENT_SECURITY_POLICY !== 'false',
    xssProtection: process.env.NEXT_PUBLIC_ENABLE_XSS_PROTECTION !== 'false',
  },

  // Performance Configuration
  performance: {
    cache: process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false',
    cacheDuration: parseInt(process.env.NEXT_PUBLIC_CACHE_DURATION || '300000'),
    lazyLoading: process.env.NEXT_PUBLIC_ENABLE_LAZY_LOADING !== 'false',
    imageOptimization: process.env.NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION !== 'false',
  },

  // Testing Configuration
  testing: {
    mockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
    mockApiDelay: parseInt(process.env.NEXT_PUBLIC_MOCK_API_DELAY || '1000'),
  },
};

// Validation function to check if required environment variables are set
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required API configuration
  if (!config.api.baseUrl) {
    errors.push('NEXT_PUBLIC_API_BASE_URL is required');
  }

  // Check required authentication configuration
  if (!config.auth.jwtStorageKey) {
    errors.push('NEXT_PUBLIC_JWT_STORAGE_KEY is required');
  }

  if (!config.auth.userStorageKey) {
    errors.push('NEXT_PUBLIC_USER_STORAGE_KEY is required');
  }

  // Check file upload configuration
  if (config.upload.maxFileSize <= 0) {
    errors.push('NEXT_PUBLIC_MAX_FILE_SIZE must be greater than 0');
  }

  if (config.upload.allowedFileTypes.length === 0) {
    errors.push('NEXT_PUBLIC_ALLOWED_FILE_TYPES must contain at least one file type');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to get environment variable with type conversion
export const getEnvVar = <T>(
  key: string,
  defaultValue: T,
  converter?: (value: string) => T
): T => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }

  if (converter) {
    try {
      return converter(value);
    } catch (error) {
      console.warn(`Failed to convert environment variable ${key}:`, error);
      return defaultValue;
    }
  }

  return value as T;
};

// Helper function to get boolean environment variable
export const getBoolEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  return getEnvVar(key, defaultValue, (value) => value === 'true');
};

// Helper function to get number environment variable
export const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
  return getEnvVar(key, defaultValue, (value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error(`Invalid number: ${value}`);
    }
    return num;
  });
};

// Helper function to get array environment variable
export const getArrayEnvVar = (key: string, defaultValue: string[] = [], separator: string = ','): string[] => {
  return getEnvVar(key, defaultValue, (value) => 
    value.split(separator).map(item => item.trim()).filter(Boolean)
  );
};

// Export default config
export default config;
