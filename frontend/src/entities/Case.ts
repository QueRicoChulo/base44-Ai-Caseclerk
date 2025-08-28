/**
 * Case entity model for CaseClerk AI.
 * Handles legal case management, CRUD operations, and Base44 API integration.
 * Provides methods for case creation, updates, search, and filtering.
 */

import { apiClient } from '@/utils/api';

export interface CaseData {
  id: string;
  case_number: string;
  title: string;
  plaintiff?: string;
  defendant?: string;
  jurisdiction?: string;
  court_address?: string;
  judge?: string;
  department?: string;
  status: 'active' | 'pending' | 'closed' | 'appealed' | 'settled';
  case_type: 'civil' | 'criminal' | 'family' | 'probate' | 'bankruptcy' | 'administrative';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  next_hearing?: string;
  statute_of_limitations?: string;
  summary?: string;
  created_date: string;
  updated_date: string;
  user_id: string;
}

export interface CaseFilters {
  status?: string;
  case_type?: string;
  priority?: string;
  search?: string;
}

export class Case {
  /**
   * Get list of cases with optional filtering and sorting
   */
  static async list(
    sortBy: string = '-updated_date',
    limit?: number,
    filters?: CaseFilters
  ): Promise<CaseData[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (limit) params.append('limit', limit.toString());
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            params.append(key, value);
          }
        });
      }

      const response = await apiClient.get(`/api/cases?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cases:', error);
      return [];
    }
  }

  /**
   * Get a specific case by ID
   */
  static async getById(id: string): Promise<CaseData | null> {
    try {
      const response = await apiClient.get(`/api/cases/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching case:', error);
      return null;
    }
  }

  /**
   * Create a new case
   */
  static async create(caseData: Omit<CaseData, 'id' | 'created_date' | 'updated_date' | 'user_id'>): Promise<CaseData> {
    try {
      const response = await apiClient.post('/api/cases', caseData);
      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  }

  /**
   * Update an existing case
   */
  static async update(id: string, caseData: Partial<CaseData>): Promise<CaseData> {
    try {
      const response = await apiClient.put(`/api/cases/${id}`, caseData);
      return response.data;
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  }

  /**
   * Delete a case
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/cases/${id}`);
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  }

  /**
   * Search cases by text query
   */
  static async search(query: string): Promise<CaseData[]> {
    try {
      const response = await apiClient.get(`/api/cases/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching cases:', error);
      return [];
    }
  }

  /**
   * Get cases by status
   */
  static async getByStatus(status: string): Promise<CaseData[]> {
    return this.list('-updated_date', undefined, { status });
  }

  /**
   * Get active cases
   */
  static async getActive(): Promise<CaseData[]> {
    return this.getByStatus('active');
  }

  /**
   * Get recent cases
   */
  static async getRecent(limit: number = 10): Promise<CaseData[]> {
    return this.list('-updated_date', limit);
  }

  /**
   * Get case statistics
   */
  static async getStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    closed: number;
    urgent: number;
  }> {
    try {
      const response = await apiClient.get('/api/cases/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching case stats:', error);
      return {
        total: 0,
        active: 0,
        pending: 0,
        closed: 0,
        urgent: 0
      };
    }
  }
}