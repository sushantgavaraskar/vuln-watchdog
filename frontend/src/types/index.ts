// User types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  emailNotifications: boolean;
  dailyDigest: boolean;
  securityAlerts: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
  createdAt: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: string;
  dependencies: Dependency[];
  collaborators: Collaborator[];
}

export interface Collaborator {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  role: string;
  invitedAt: string;
}

// Dependency types
export interface Dependency {
  id: number;
  name: string;
  version: string;
  projectId: number;
  issues: Issue[];
}

// Issue/Vulnerability types
export interface Issue {
  id: number;
  title: string;
  description?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dependencyId: number;
  cveId?: string;
  createdAt: string;
}

// Notification types
export interface Notification {
  id: number;
  message: string;
  type: 'system' | 'security' | 'scan' | 'collaboration';
  metadata?: any;
  read: boolean;
  userId: number;
  createdAt: string;
}

// Scan types
export interface ScanResult {
  totalDependencies: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  scanDate: string;
  results: ScanDependencyResult[];
}

export interface ScanDependencyResult {
  dependency: Dependency;
  vulnerabilities: Issue[];
  vulnerabilityCount: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// File upload types
export interface FileUploadResponse {
  totalDependencies: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  scanDate: string;
  results: ScanDependencyResult[];
}

// SSE Event types
export interface SSEEvent {
  type: 'connected' | 'new_notification' | 'unread_count' | 'heartbeat';
  message?: string;
  notification?: Notification;
  count?: number;
  timestamp?: number;
}

// Admin types
export interface AdminUser extends Omit<User, 'password'> {
  createdAt: string;
}

export interface AdminProject extends Project {
  user: {
    id: number;
    name: string;
    email: string;
  };
  totalDependencies: number;
  totalVulnerabilities: number;
}

export interface AuditLog {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  action: string;
  details: string;
  createdAt: string;
}
