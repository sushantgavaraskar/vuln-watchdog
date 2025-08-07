import {
  AuthResponse,
  LoginData,
  RegisterData,
  UpdateProfileData,
  User,
  Project,
  CreateProjectData,
  Collaborator,
  ScanResult,
  ScanHistory,
  NotificationResponse,
  NotificationParams,
  AlertConfig,
  UnreadCountResponse,
  AuditLog,
  ApiError,
  ExportFormat
} from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Updated to match backend default

class ApiErrorClass extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE;
  }

  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new ApiErrorClass(
          data.error || 'API Error',
          response.status,
          data.details
        );
      }
      
      return data;
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        throw error;
      }
      throw new ApiErrorClass('Network error', 0);
    }
  }

  // Authentication
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  async forgotPassword(email: string): Promise<void> {
    return this.request<void>('/auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // User Management
  async getProfile(): Promise<User> {
    return this.request<User>('/user/profile');
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Project Management
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/project');
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.request<Project>('/project', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getProject(id: number): Promise<Project> {
    return this.request<Project>(`/project/${id}`);
  }

  async addCollaborator(projectId: number, email: string): Promise<Collaborator> {
    return this.request<Collaborator>(`/project/${projectId}/collaborator`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async exportProject(id: number, format: ExportFormat = 'pdf'): Promise<Blob> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/project/${id}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiErrorClass(error.error || 'Export failed', response.status);
    }

    return response.blob();
  }

  // Vulnerability Scanning
  async uploadAndScan(file: File, projectId: number): Promise<ScanResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.toString());

    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/scan`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiErrorClass(error.error || 'Scan failed', response.status, error.details);
    }

    return response.json();
  }

  async getScanResults(projectId: number): Promise<ScanResult> {
    return this.request<ScanResult>(`/scan/${projectId}`);
  }

  async getScanHistory(projectId: number): Promise<ScanHistory[]> {
    return this.request<ScanHistory[]>(`/scan/history/${projectId}`);
  }

  // Notifications
  async getNotifications(params: NotificationParams = {}): Promise<NotificationResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.type) searchParams.append('type', params.type);

    return this.request<NotificationResponse>(`/notifications?${searchParams.toString()}`);
  }

  async markAsRead(notificationId: number): Promise<void> {
    return this.request<void>('/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ notificationId })
    });
  }

  async markAllAsRead(): Promise<void> {
    return this.request<void>('/notifications/read-all', { method: 'POST' });
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return this.request<UnreadCountResponse>('/notifications/unread-count');
  }

  async createTestNotification(message: string, type: string): Promise<void> {
    return this.request<void>('/notifications/test', {
      method: 'POST',
      body: JSON.stringify({ message, type })
    });
  }

  // Alerts
  async setAlertConfig(config: AlertConfig): Promise<void> {
    return this.request<void>('/alerts/config', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async sendTestAlert(): Promise<void> {
    return this.request<void>('/alerts/test', { method: 'POST' });
  }

  // Admin (requires admin role)
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/admin/users');
  }

  async getAdminProjects(): Promise<Project[]> {
    return this.request<Project[]>('/admin/projects');
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.request<AuditLog[]>('/admin/logs');
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // SSE Connection for real-time notifications
  createSSEConnection(): EventSource {
    const token = localStorage.getItem('token');
    // Pass token as query param for SSE authentication
    const url = `${this.baseURL}/notifications/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    const eventSource = new EventSource(url);
    return eventSource;
  }
}

export const apiClient = new ApiClient();
export { ApiErrorClass as ApiError }; 