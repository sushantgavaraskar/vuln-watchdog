import { User } from '@/types';
import { config } from './config';

// JWT token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(config.auth.jwtStorageKey);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(config.auth.jwtStorageKey, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(config.auth.jwtStorageKey);
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(config.auth.userStorageKey);
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(config.auth.userStorageKey, JSON.stringify(user));
};

export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(config.auth.userStorageKey);
};

// JWT parsing (basic implementation)
export const parseJWT = (token: string): unknown => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJWT(token) as { exp?: number } | null;
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

// Role guards
export const requireRole = (requiredRole: 'user' | 'admin') => {
  return (user: User | null): boolean => {
    if (!user) return false;
    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }
    return user.role === 'user' || user.role === 'admin';
  };
};

export const isAdmin = (user: User | null): boolean => {
  return requireRole('admin')(user);
};

export const isUser = (user: User | null): boolean => {
  return requireRole('user')(user);
};

// Auth state management
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};
