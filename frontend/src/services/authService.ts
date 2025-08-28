import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
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
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
}

// Auth Service
export const authService = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      return {
        success: true,
        message: 'Login successful',
        data: { user, token }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Login failed',
        data: undefined
      };
    }
  },

  // Register
  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      return {
        success: true,
        message: 'Registration successful',
        data: { user, token }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Registration failed',
        data: undefined
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token regardless of API response
      localStorage.removeItem('token');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        message: 'User retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to get user profile',
        data: undefined
      };
    }
  },

  // Update user profile
  async updateProfile(data: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.put('/auth/profile', data);
      return {
        success: true,
        message: 'Profile updated successfully',
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to update user profile',
        data: undefined
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Guest login (for demo purposes)
  async guestLogin(): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/guest-login');
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      
      return {
        success: true,
        message: 'Guest login successful',
        data: { user, token }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Guest login failed',
        data: undefined
      };
    }
  },

  // Admin login (for demo purposes)
  async adminLogin(): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/admin-login');
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      
      return {
        success: true,
        message: 'Admin login successful',
        data: { user, token }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Admin login failed',
        data: undefined
      };
    }
  }
};

export default authService;
