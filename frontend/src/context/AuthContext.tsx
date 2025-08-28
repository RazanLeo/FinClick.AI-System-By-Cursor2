import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginResponse, RegisterResponse } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (username: string, email: string, password: string) => Promise<RegisterResponse>;
  logout: () => void;
  guestLogin: () => Promise<LoginResponse>;
  adminLogin: () => Promise<LoginResponse>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authService.login(email, password);
      if (response.data) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.access_token);
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await authService.register(username, email, password);
      if (response.data) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.access_token);
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const guestLogin = async (): Promise<LoginResponse> => {
    // Simulate guest login
    const guestUser: User = {
      id: 'guest-1',
      username: 'guest_user',
      email: 'guest@example.com',
      firstName: 'زائر',
      lastName: 'مستخدم',
      phone: '',
      language: 'ar',
      timezone: 'Asia/Riyadh',
      currency: 'SAR',
      bio: '',
      avatar: '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      role: 'user'
    };
    
    setUser(guestUser);
    localStorage.setItem('token', 'guest-token');
    
    return {
      success: true,
      data: {
        user: guestUser,
        access_token: 'guest-token',
        refresh_token: 'guest-refresh-token'
      },
      message: 'تم تسجيل الدخول كزائر بنجاح'
    };
  };

  const adminLogin = async (): Promise<LoginResponse> => {
    // Simulate admin login
    const adminUser: User = {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@finclick.ai',
      firstName: 'مدير',
      lastName: 'النظام',
      phone: '+966501234567',
      language: 'ar',
      timezone: 'Asia/Riyadh',
      currency: 'SAR',
      bio: 'مدير نظام FinClick.AI',
      avatar: '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      role: 'admin'
    };
    
    setUser(adminUser);
    localStorage.setItem('token', 'admin-token');
    
    return {
      success: true,
      data: {
        user: adminUser,
        access_token: 'admin-token',
        refresh_token: 'admin-refresh-token'
      },
      message: 'تم تسجيل الدخول كمدير بنجاح'
    };
  };

  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    guestLogin,
    adminLogin,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
