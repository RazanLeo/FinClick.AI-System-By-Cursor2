import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  language: string;
  timezone: string;
  currency: string;
  bio: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  role: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
  message: string;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  message: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  language?: string;
  timezone?: string;
  currency?: string;
  bio?: string;
}

// Auth Service
export const authService = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      return {
        success: true,
        data: response.data,
        message: 'تم تسجيل الدخول بنجاح'
      };
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'فشل تسجيل الدخول'
      };
    }
  },

  // Register
  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post('/api/v1/auth/register', { username, email, password });
      return {
        success: true,
        data: response.data,
        message: 'تم التسجيل بنجاح'
      };
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'فشل التسجيل'
      };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await api.get('/api/v1/auth/me');
      return {
        success: true,
        data: response.data,
        message: 'تم جلب بيانات المستخدم بنجاح'
      };
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'فشل جلب بيانات المستخدم'
      };
    }
  },

  // Update user profile
  async updateProfile(profileData: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.put('/api/v1/auth/profile', profileData);
      return {
        success: true,
        data: response.data,
        message: 'تم تحديث الملف الشخصي بنجاح'
      };
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.response?.data?.message || 'فشل تحديث الملف الشخصي'
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Guest login (for demo purposes)
  async guestLogin(): Promise<LoginResponse> {
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

    return {
      success: true,
      data: {
        user: guestUser,
        access_token: 'guest-token',
        refresh_token: 'guest-refresh-token'
      },
      message: 'تم تسجيل الدخول كزائر بنجاح'
    };
  },

  // Admin login (for demo purposes)
  async adminLogin(): Promise<LoginResponse> {
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

    return {
      success: true,
      data: {
        user: adminUser,
        access_token: 'admin-token',
        refresh_token: 'admin-refresh-token'
      },
      message: 'تم تسجيل الدخول كمدير بنجاح'
    };
  }
};
