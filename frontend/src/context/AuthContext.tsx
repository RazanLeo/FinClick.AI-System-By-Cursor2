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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      // Get current user info
      authService.getCurrentUser()
        .then(response => {
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          // Error occurred, remove token
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed',
        data: undefined
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.register(username, email, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed',
        data: undefined
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const guestLogin = async (): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.guestLogin();
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Guest login failed',
        data: undefined
      };
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.adminLogin();
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Admin login failed',
        data: undefined
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    guestLogin,
    adminLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
