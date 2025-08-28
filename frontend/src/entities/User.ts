/**
 * User entity model for CaseClerk AI.
 * Handles user authentication, profile management, and Base44 API integration.
 * Provides methods for user CRUD operations and session management.
 */

import { apiClient } from '@/utils/api';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  bar_number?: string;
  license_level: 'student' | 'pro_per' | 'paralegal' | 'attorney' | 'firm_admin';
  firm_name?: string;
  firm_address?: string;
  phone_primary: string;
  phone_secondary?: string;
  website?: string;
  default_jurisdiction?: string;
  default_court?: string;
  storage_location: 'local' | 'vps' | 'cloud';
  api_keys: {
    openai?: string;
    anthropic?: string;
    vonage?: string;
    elevenlabs?: string;
  };
  feature_flags: {
    ai_calling: boolean;
    legal_research: boolean;
    advanced_analytics: boolean;
  };
  onboarding_completed: boolean;
  created_date: string;
  updated_date: string;
}

export class User {
  /**
   * Get current authenticated user profile
   */
  static async me(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update current user's profile data
   */
  static async updateMyUserData(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/api/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user's onboarding status
   */
  static async completeOnboarding(): Promise<void> {
    try {
      await apiClient.put('/api/users/me', { onboarding_completed: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Get user's API key for Base44 integration
   */
  static async getApiKey(): Promise<string | null> {
    try {
      const user = await this.me();
      return user?.api_keys?.openai || process.env.NEXT_PUBLIC_API_KEY || null;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  /**
   * Authenticate user with email and password
   */
  static async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Register new user account
   */
  static async register(userData: {
    email: string;
    password: string;
    full_name: string;
    license_level: string;
  }): Promise<{ user: UserProfile; token: string }> {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
}