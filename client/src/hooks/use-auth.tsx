import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  emailNotifications: boolean;
  dailyDigest: boolean;
  securityAlerts: boolean;
  alertFrequency: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiClient.getUserProfile();
          setUser(userData as User);
        } catch (error) {
          localStorage.removeItem('token');
          console.error('Token validation failed:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user as User);
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Login failed",
        description: apiError.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await apiClient.register({ email, password, name });
      localStorage.setItem('token', response.token);
      setUser(response.user as User);
      toast({
        title: "Registration successful",
        description: "Welcome to VulnWatch!"
      });
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Registration failed",
        description: apiError.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!"
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await apiClient.updateUserProfile(userData);
      setUser(updatedUser as User);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Update failed",
        description: apiError.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};