// DEPRECATED: Use api-client.ts for all API calls. This file is kept for legacy support.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Updated to match backend default

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
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
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(data.error || 'API Error', response.status, data.details);
    }
    
    return data;
  }

  // Authentication
  async register(userData: { email: string; password: string; name: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // User Management
  async getUserProfile() {
    return this.request<any>('/user/profile');
  }

  async updateUserProfile(userData: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Project Management
  async getProjects() {
    return this.request<any[]>('/project');
  }

  async createProject(projectData: { name: string; description?: string }) {
    return this.request('/project', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async getProject(id: string) {
    return this.request(`/project/${id}`);
  }

  async addCollaborator(projectId: string, email: string) {
    return this.request(`/project/${projectId}/collaborator`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async exportProject(projectId: string) {
    return this.request(`/project/${projectId}/export`);
  }

  // Vulnerability Scanning
  async uploadAndScan(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const response = await fetch(`${this.baseURL}/scan`, {
      method: 'POST',
      headers: { 
        Authorization: this.getHeaders().Authorization || ''
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.error || 'Scan failed', response.status, error.details);
    }

    return response.json();
  }

  async getScanResults(projectId: string) {
    return this.request(`/scan/${projectId}`);
  }

  async getScanHistory(projectId: string) {
    return this.request(`/scan/history/${projectId}`);
  }

  // Notifications
  async getNotifications(page = 1, limit = 20) {
    return this.request(`/notifications?page=${page}&limit=${limit}`);
  }

  async markAsRead(notificationId: string) {
    return this.request('/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ notificationId })
    });
  }

  async markAllAsRead() {
    return this.request('/notifications/read-all', { method: 'POST' });
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/notifications/unread-count');
  }

  async createTestNotification() {
    return this.request('/notifications/test', { method: 'POST' });
  }

  // Alerts
  async setAlertConfig(config: any) {
    return this.request('/alerts/config', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }

  async sendTestAlert() {
    return this.request('/alerts/test', { method: 'POST' });
  }

  // Admin (requires admin role)
  async getUsers() {
    return this.request('/admin/users');
  }

  async getAdminProjects() {
    return this.request('/admin/projects');
  }

  async getAuditLogs() {
    return this.request('/admin/logs');
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();