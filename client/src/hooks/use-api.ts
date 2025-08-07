import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type {
  User,
  Project,
  CreateProjectData,
  UpdateProfileData,
  ScanResult,
  ScanHistory,
  NotificationResponse,
  NotificationParams,
  AlertConfig,
  LoginData,
  RegisterData,
  Collaborator
} from '@/types';

// Query Keys
export const queryKeys = {
  user: ['user'] as const,
  projects: ['projects'] as const,
  project: (id: number) => ['project', id] as const,
  scanResults: (projectId: number) => ['scan', projectId] as const,
  scanHistory: (projectId: number) => ['scanHistory', projectId] as const,
  notifications: (params?: NotificationParams) => ['notifications', params] as const,
  unreadCount: ['unreadCount'] as const,
  admin: {
    users: ['admin', 'users'] as const,
    projects: ['admin', 'projects'] as const,
    logs: ['admin', 'logs'] as const,
  },
} as const;

// Authentication Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginData) => apiClient.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(queryKeys.user, data.user);
      toast.success('Login successful');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: RegisterData) => apiClient.register(userData),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(queryKeys.user, data.user);
      toast.success('Registration successful');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => apiClient.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
};

// User Hooks
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiClient.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileData) => apiClient.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.user, updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

// Project Hooks
export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => apiClient.getProjects(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => apiClient.getProject(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProjectData) => apiClient.createProject(data),
    onSuccess: (newProject) => {
      queryClient.setQueryData(queryKeys.projects, (old: Project[] = []) => [...old, newProject]);
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
};

export const useAddCollaborator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, email }: { projectId: number; email: string }) =>
      apiClient.addCollaborator(projectId, email),
    onSuccess: (collaborator, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      toast.success('Collaborator added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add collaborator');
    },
  });
};

export const useExportProject = () => {
  return useMutation({
    mutationFn: ({ id, format }: { id: number; format: 'pdf' | 'csv' }) =>
      apiClient.exportProject(id, format),
    onSuccess: (blob, { id, format }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${id}-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export report');
    },
  });
};

// Scanning Hooks
export const useUploadAndScan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, projectId }: { file: File; projectId: number }) =>
      apiClient.uploadAndScan(file, projectId),
    onSuccess: (result, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scanResults(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.scanHistory(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      toast.success('Scan completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Scan failed');
    },
  });
};

export const useScanResults = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.scanResults(projectId),
    queryFn: () => apiClient.getScanResults(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useScanHistory = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.scanHistory(projectId),
    queryFn: () => apiClient.getScanHistory(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Notification Hooks
export const useNotifications = (params: NotificationParams = {}) => {
  return useQuery({
    queryKey: queryKeys.notifications(params),
    queryFn: () => apiClient.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: () => apiClient.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: number) => apiClient.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notifications as read');
    },
  });
};

export const useCreateTestNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ message, type }: { message: string; type: string }) =>
      apiClient.createTestNotification(message, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
      toast.success('Test notification created');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create test notification');
    },
  });
};

// Alert Hooks
export const useSetAlertConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (config: AlertConfig) => apiClient.setAlertConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      toast.success('Alert configuration updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update alert configuration');
    },
  });
};

export const useSendTestAlert = () => {
  return useMutation({
    mutationFn: () => apiClient.sendTestAlert(),
    onSuccess: () => {
      toast.success('Test alert sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send test alert');
    },
  });
};

// Admin Hooks
export const useAdminUsers = () => {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: () => apiClient.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminProjects = () => {
  return useQuery({
    queryKey: queryKeys.admin.projects,
    queryFn: () => apiClient.getAdminProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminLogs = () => {
  return useQuery({
    queryKey: queryKeys.admin.logs,
    queryFn: () => apiClient.getAuditLogs(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}; 