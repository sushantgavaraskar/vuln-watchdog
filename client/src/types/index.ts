// Core Types
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

export interface Project {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: string;
  dependencies?: Dependency[];
  collaborators?: Collaborator[];
  totalDependencies?: number;
  totalVulnerabilities?: number;
}

export interface Dependency {
  id: number;
  name: string;
  version: string;
  projectId: number;
  issues?: Issue[];
}

export interface Issue {
  id: number;
  title: string;
  description?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dependencyId: number;
  cveId?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'system' | 'security' | 'scan' | 'collaboration';
  metadata?: string; // JSON string
  read: boolean;
  userId: number;
  createdAt: string;
}

export interface Collaborator {
  id: number;
  userId: number;
  projectId: number;
  role: string;
  invitedAt: string;
  user?: User;
}

export interface AuditLog {
  id: number;
  userId?: number;
  user?: User;
  action: string;
  details?: string;
  createdAt: string;
}

// API Request/Response Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileData {
  name?: string;
  emailNotifications?: boolean;
  dailyDigest?: boolean;
  securityAlerts?: boolean;
  alertFrequency?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface ScanResult {
  totalDependencies: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities?: number;
  mediumVulnerabilities?: number;
  lowVulnerabilities?: number;
  scanDate: string;
  results: ScanDependencyResult[];
  projectId?: number;
  lastScan?: string;
  dependencies?: Dependency[];
}

export interface ScanDependencyResult {
  dependency: Dependency;
  vulnerabilities: Issue[];
  vulnerabilityCount: number;
  error?: string;
}

export interface ScanHistory {
  id: number;
  scanDate: string;
  totalDependencies: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  type?: string;
}

export interface AlertConfig {
  emailNotifications: boolean;
  dailyDigest: boolean;
  securityAlerts: boolean;
  alertFrequency: string;
}

export interface UnreadCountResponse {
  count: number;
}

// SSE Event Types
export interface SSEEvent {
  type: 'connected' | 'new_notification' | 'unread_count' | 'heartbeat';
  message?: string;
  notification?: Notification;
  count?: number;
  timestamp?: number;
}

// Component Props Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export interface FileUploadProps {
  onUpload: (file: File) => Promise<ScanResult>;
  projectId: number;
}

export interface ProjectCardProps {
  project: Project;
  onView: (id: number) => void;
  onScan: (id: number) => void;
}

export interface VulnerabilityCardProps {
  issue: Issue;
  dependency: Dependency;
}

export interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface ProjectFormData {
  name: string;
  description: string;
}

export interface AlertConfigFormData {
  emailNotifications: boolean;
  dailyDigest: boolean;
  securityAlerts: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
}

// Chart Data Types
export interface VulnerabilityChartData {
  name: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SecurityScoreData {
  name: string;
  score: number;
  maxScore: number;
}

export interface ScanTrendData {
  date: string;
  vulnerabilities: number;
  dependencies: number;
}

// Utility Types
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type NotificationType = 'system' | 'security' | 'scan' | 'collaboration';
export type AlertFrequency = 'immediate' | 'daily' | 'weekly';
export type ExportFormat = 'pdf' | 'csv';

// API Error Types
export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}

// File Upload Types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface SupportedFileType {
  extension: string;
  name: string;
  description: string;
  examples: string[];
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProjects: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  securityScore: number;
  recentScans: number;
  unreadNotifications: number;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  severity?: SeverityLevel[];
  type?: NotificationType[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 