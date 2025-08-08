import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getToken, clearAuth } from './auth';
import { ApiResponse } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'https://vuln-watchdog-1.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (credentials: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot', { email });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (profile: Partial<{ name: string; emailNotifications: boolean; dailyDigest: boolean; securityAlerts: boolean; alertFrequency: string }>) => {
    const response = await api.put('/user/profile', profile);
    return response.data;
  },
};

// Project API
export const projectAPI = {
  create: async (project: { name: string; description?: string }) => {
    const response = await api.post('/project', project);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/project');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/project/${id}`);
    return response.data;
  },

  addCollaborator: async (projectId: number, email: string) => {
    const response = await api.post(`/project/${projectId}/collaborator`, { email });
    return response.data;
  },

  export: async (projectId: number, format: 'pdf' | 'csv' = 'pdf') => {
    const response = await api.get(`/project/${projectId}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Scan API
export const scanAPI = {
  uploadFile: async (file: File, projectId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.toString());

    const response = await api.post('/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getResults: async (projectId: number) => {
    const response = await api.get(`/scan/${projectId}`);
    return response.data;
  },

  getHistory: async (projectId: number) => {
    const response = await api.get(`/scan/history/${projectId}`);
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getList: async (page: number = 1, limit: number = 20, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (type) params.append('type', type);

    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  markAsRead: async (notificationId: number) => {
    const response = await api.post('/notifications/read', { notificationId });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  createTest: async (message: string, type: string) => {
    const response = await api.post('/notifications/test', { message, type });
    return response.data;
  },
};

// Alerts API
export const alertsAPI = {
  updateConfig: async (config: {
    emailNotifications: boolean;
    dailyDigest: boolean;
    securityAlerts: boolean;
    alertFrequency: string;
  }) => {
    const response = await api.post('/alerts/config', config);
    return response.data;
  },

  sendTest: async () => {
    const response = await api.post('/alerts/test');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/admin/projects');
    return response.data;
  },

  getLogs: async () => {
    const response = await api.get('/admin/logs');
    return response.data;
  },
};

// SSE endpoints
export const sseEndpoints = {
  notifications: '/notifications/stream',
  adminLogs: '/admin/sse',
};

export default api;
