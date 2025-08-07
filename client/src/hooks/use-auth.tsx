import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useLogin, useRegister, useLogout } from './use-api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // React Query hooks
  const { data: userData, isLoading: userLoading, error: userError } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // User data will be fetched automatically by React Query
    if (userData) {
      setUser(userData);
    }
    
    if (!userLoading) {
      setLoading(false);
    }
  }, [userData, userLoading]);

  // Update user state when userData changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (userError) {
      // Token is invalid, clear it
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [userData, userError]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync({ email, password, name });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    logoutMutation.mutate();
    setUser(null);
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    loading: loading || userLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};