'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, isAuthenticated } from '@/utils/auth';
import { authAPI } from '@/utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const storedUser = getUser();
          if (storedUser) {
            setUserState(storedUser);
          } else {
            // Token exists but no user data, try to fetch user profile
            try {
              const userData = await authAPI.getProfile();
              setUserState(userData);
              setUser(userData);
            } catch (error) {
              // Invalid token, clear auth
              removeToken();
              removeUser();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeToken();
        removeUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      setToken(response.token);
      setUser(response.user);
      setUserState(response.user);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const response = await authAPI.register({ email, password, name });
      
      setToken(response.token);
      setUser(response.user);
      setUserState(response.user);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      removeUser();
      setUserState(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUserState(updatedUser);
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
