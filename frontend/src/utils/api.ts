/**
 * API client configuration for CaseClerk AI.
 * Handles HTTP requests, authentication, error handling, and Base44 integration.
 * Provides centralized API communication with automatic token management.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BASE44_API_URL = 'https://app.base44.com/api/apps/68a362a1664b8f811bac8895';
const BASE44_API_KEY = process.env.NEXT_PUBLIC_BASE44_API_KEY || '0fdc722fdcac4237a61e75148cf3f8b1';

/**
 * Main API client for CaseClerk AI backend
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Base44 API client for external integrations
 */
export const base44Client: AxiosInstance = axios.create({
  baseURL: BASE44_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'api_key': BASE44_API_KEY,
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development' && response.config.metadata) {
      const endTime = new Date();
      const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
      console.log(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { access_token } = response.data;
          localStorage.setItem('auth_token', access_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_profile');
          window.location.href = '/login';
        }
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    // Handle API errors
    const { status, data } = error.response;
    let errorMessage = 'An unexpected error occurred';

    switch (status) {
      case 400:
        errorMessage = data.message || 'Bad request';
        break;
      case 401:
        errorMessage = 'Authentication required';
        break;
      case 403:
        errorMessage = 'Access denied';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 422:
        errorMessage = data.message || 'Validation error';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = data.message || `HTTP ${status} error`;
    }

    console.error('API Error:', {
      status,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method,
      data: data
    });

    throw new Error(errorMessage);
  }
);

// Base44 client error handling
base44Client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Base44 API Error:', error.response?.data || error.message);
    throw error;
  }
);

/**
 * API utility functions
 */
export const api = {
  /**
   * GET request with error handling
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  /**
   * POST request with error handling
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request with error handling
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * DELETE request with error handling
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete(url, config);
    return response.data;
  },

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
};

/**
 * Base44 API utility functions
 */
export const base44Api = {
  /**
   * Fetch entities from Base44
   */
  async fetchEntities<T = any>(entityType: string, filters?: Record<string, any>): Promise<T[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `/entities/${entityType}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await base44Client.get(url);
    return response.data;
  },

  /**
   * Update entity in Base44
   */
  async updateEntity<T = any>(entityType: string, entityId: string, data: any): Promise<T> {
    const response = await base44Client.put(`/entities/${entityType}/${entityId}`, data);
    return response.data;
  },

  /**
   * Create entity in Base44
   */
  async createEntity<T = any>(entityType: string, data: any): Promise<T> {
    const response = await base44Client.post(`/entities/${entityType}`, data);
    return response.data;
  },

  /**
   * Delete entity from Base44
   */
  async deleteEntity(entityType: string, entityId: string): Promise<void> {
    await base44Client.delete(`/entities/${entityType}/${entityId}`);
  }
};

/**
 * Authentication utilities
 */
export const auth = {
  /**
   * Set authentication token
   */
  setToken(token: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    }
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export default apiClient;