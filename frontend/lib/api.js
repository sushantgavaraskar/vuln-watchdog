import axios from 'axios'
import Cookies from 'js-cookie'

export const API_BASE = 'https://vuln-watchdog-1.onrender.com/api'

const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// Convenience wrappers
export const AuthAPI = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  logout: () => api.post('/auth/logout'),
  forgot: (payload) => api.post('/auth/forgot', payload),
}

export const UserAPI = {
  profile: () => api.get('/user/profile'),
  updateProfile: (payload) => api.put('/user/profile', payload),
}

export const ProjectAPI = {
  create: (payload) => api.post('/project', payload),
  list: () => api.get('/project'),
  details: (id) => api.get(`/project/${id}`),
  addCollaborator: (id, payload) => api.post(`/project/${id}/collaborator`, payload),
  export: (id, format = 'pdf') => api.get(`/project/${id}/export?format=${format}`, { responseType: 'blob' }),
}

export const ScanAPI = {
  upload: (formData) => api.post('/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  results: (projectId) => api.get(`/scan/${projectId}`),
  history: (projectId) => api.get(`/scan/history/${projectId}`),
}

export const NotificationsAPI = {
  list: (params) => api.get('/notifications', { params }),
  read: (payload) => api.post('/notifications/read', payload),
  readAll: () => api.post('/notifications/read-all'),
  unreadCount: () => api.get('/notifications/unread-count'),
  test: (payload) => api.post('/notifications/test', payload),
}

export const AlertsAPI = {
  setConfig: (payload) => api.post('/alerts/config', payload),
  test: () => api.post('/alerts/test'),
}

export const AdminAPI = {
  users: () => api.get('/admin/users'),
  projects: () => api.get('/admin/projects'),
  logs: () => api.get('/admin/logs'),
}


