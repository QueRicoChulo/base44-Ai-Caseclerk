/**
 * Base44 platform integration service for CaseClerk AI.
 * Handles communication with Base44 API for data persistence and external integrations.
 * Provides unified interface for entity management and platform features.
 */

import axios, { AxiosInstance } from 'axios';

const BASE44_API_URL = process.env.BASE44_API_URL || 'https://app.base44.com/api/apps/68a362a1664b8f811bac8895';
const BASE44_API_KEY = process.env.BASE44_API_KEY || '0fdc722fdcac4237a61e75148cf3f8b1';

/**
 * Base44 API client configuration
 */
const base44Client: AxiosInstance = axios.create({
  baseURL: BASE44_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'api_key': BASE44_API_KEY,
  },
});

// Response interceptor for error handling
base44Client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Base44 API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
);

/**
 * Base44 API service class
 */
export class Base44Service {
  /**
   * Fetch entities from Base44 platform
   */
  static async fetchEntities<T = any>(
    entityType: string,
    filters?: Record<string, any>
  ): Promise<T[]> {
    try {
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
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching ${entityType} entities:`, error);
      return [];
    }
  }

  /**
   * Create entity in Base44 platform
   */
  static async createEntity<T = any>(
    entityType: string,
    data: any
  ): Promise<T> {
    try {
      const response = await base44Client.post(`/entities/${entityType}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${entityType} entity:`, error);
      throw error;
    }
  }

  /**
   * Update entity in Base44 platform
   */
  static async updateEntity<T = any>(
    entityType: string,
    entityId: string,
    data: any
  ): Promise<T> {
    try {
      const response = await base44Client.put(`/entities/${entityType}/${entityId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${entityType} entity:`, error);
      throw error;
    }
  }

  /**
   * Delete entity from Base44 platform
   */
  static async deleteEntity(
    entityType: string,
    entityId: string
  ): Promise<void> {
    try {
      await base44Client.delete(`/entities/${entityType}/${entityId}`);
    } catch (error) {
      console.error(`Error deleting ${entityType} entity:`, error);
      throw error;
    }
  }

  /**
   * Get entity by ID from Base44 platform
   */
  static async getEntityById<T = any>(
    entityType: string,
    entityId: string
  ): Promise<T | null> {
    try {
      const response = await base44Client.get(`/entities/${entityType}/${entityId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`Error fetching ${entityType} entity by ID:`, error);
      throw error;
    }
  }

  /**
   * Search entities in Base44 platform
   */
  static async searchEntities<T = any>(
    entityType: string,
    searchQuery: string,
    searchFields?: string[]
  ): Promise<T[]> {
    try {
      const params = new URLSearchParams();
      params.append('search', searchQuery);
      
      if (searchFields && searchFields.length > 0) {
        params.append('fields', searchFields.join(','));
      }

      const response = await base44Client.get(`/entities/${entityType}/search?${params.toString()}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error searching ${entityType} entities:`, error);
      return [];
    }
  }

  /**
   * Get entity statistics from Base44 platform
   */
  static async getEntityStats(entityType: string): Promise<{
    total: number;
    created_today: number;
    updated_today: number;
  }> {
    try {
      const response = await base44Client.get(`/entities/${entityType}/stats`);
      return response.data || { total: 0, created_today: 0, updated_today: 0 };
    } catch (error) {
      console.error(`Error fetching ${entityType} stats:`, error);
      return { total: 0, created_today: 0, updated_today: 0 };
    }
  }

  /**
   * Bulk create entities in Base44 platform
   */
  static async bulkCreateEntities<T = any>(
    entityType: string,
    entities: any[]
  ): Promise<T[]> {
    try {
      const response = await base44Client.post(`/entities/${entityType}/bulk`, {
        entities
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error bulk creating ${entityType} entities:`, error);
      throw error;
    }
  }

  /**
   * Bulk update entities in Base44 platform
   */
  static async bulkUpdateEntities<T = any>(
    entityType: string,
    updates: { id: string; data: any }[]
  ): Promise<T[]> {
    try {
      const response = await base44Client.put(`/entities/${entityType}/bulk`, {
        updates
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error bulk updating ${entityType} entities:`, error);
      throw error;
    }
  }

  /**
   * Get platform health status
   */
  static async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    response_time: number;
    last_check: string;
  }> {
    try {
      const startTime = Date.now();
      await base44Client.get('/health');
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        response_time: responseTime,
        last_check: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'down',
        response_time: -1,
        last_check: new Date().toISOString()
      };
    }
  }

  /**
   * Upload file to Base44 platform
   */
  static async uploadFile(
    file: Buffer,
    filename: string,
    mimeType: string,
    metadata?: Record<string, any>
  ): Promise<{
    file_id: string;
    file_url: string;
    file_size: number;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([file], { type: mimeType }), filename);
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const response = await base44Client.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file to Base44:', error);
      throw error;
    }
  }

  /**
   * Delete file from Base44 platform
   */
  static async deleteFile(fileId: string): Promise<void> {
    try {
      await base44Client.delete(`/files/${fileId}`);
    } catch (error) {
      console.error('Error deleting file from Base44:', error);
      throw error;
    }
  }

  /**
   * Get file download URL from Base44 platform
   */
  static async getFileDownloadUrl(fileId: string): Promise<string> {
    try {
      const response = await base44Client.get(`/files/${fileId}/download-url`);
      return response.data.url;
    } catch (error) {
      console.error('Error getting file download URL:', error);
      throw error;
    }
  }
}

/**
 * Convenience functions for specific entity types
 */
export const base44Api = {
  // Cases
  cases: {
    list: (filters?: any) => Base44Service.fetchEntities('Case', filters),
    create: (data: any) => Base44Service.createEntity('Case', data),
    update: (id: string, data: any) => Base44Service.updateEntity('Case', id, data),
    delete: (id: string) => Base44Service.deleteEntity('Case', id),
    getById: (id: string) => Base44Service.getEntityById('Case', id),
    search: (query: string) => Base44Service.searchEntities('Case', query),
    stats: () => Base44Service.getEntityStats('Case')
  },

  // Documents
  documents: {
    list: (filters?: any) => Base44Service.fetchEntities('Document', filters),
    create: (data: any) => Base44Service.createEntity('Document', data),
    update: (id: string, data: any) => Base44Service.updateEntity('Document', id, data),
    delete: (id: string) => Base44Service.deleteEntity('Document', id),
    getById: (id: string) => Base44Service.getEntityById('Document', id),
    search: (query: string) => Base44Service.searchEntities('Document', query),
    stats: () => Base44Service.getEntityStats('Document')
  },

  // Users
  users: {
    list: (filters?: any) => Base44Service.fetchEntities('User', filters),
    create: (data: any) => Base44Service.createEntity('User', data),
    update: (id: string, data: any) => Base44Service.updateEntity('User', id, data),
    delete: (id: string) => Base44Service.deleteEntity('User', id),
    getById: (id: string) => Base44Service.getEntityById('User', id),
    search: (query: string) => Base44Service.searchEntities('User', query),
    stats: () => Base44Service.getEntityStats('User')
  },

  // Call Logs
  callLogs: {
    list: (filters?: any) => Base44Service.fetchEntities('CallLog', filters),
    create: (data: any) => Base44Service.createEntity('CallLog', data),
    update: (id: string, data: any) => Base44Service.updateEntity('CallLog', id, data),
    delete: (id: string) => Base44Service.deleteEntity('CallLog', id),
    getById: (id: string) => Base44Service.getEntityById('CallLog', id),
    search: (query: string) => Base44Service.searchEntities('CallLog', query),
    stats: () => Base44Service.getEntityStats('CallLog')
  },

  // Calendar Events
  calendarEvents: {
    list: (filters?: any) => Base44Service.fetchEntities('CalendarEvent', filters),
    create: (data: any) => Base44Service.createEntity('CalendarEvent', data),
    update: (id: string, data: any) => Base44Service.updateEntity('CalendarEvent', id, data),
    delete: (id: string) => Base44Service.deleteEntity('CalendarEvent', id),
    getById: (id: string) => Base44Service.getEntityById('CalendarEvent', id),
    search: (query: string) => Base44Service.searchEntities('CalendarEvent', query),
    stats: () => Base44Service.getEntityStats('CalendarEvent')
  },

  // Platform utilities
  health: () => Base44Service.getHealthStatus(),
  uploadFile: (file: Buffer, filename: string, mimeType: string, metadata?: any) =>
    Base44Service.uploadFile(file, filename, mimeType, metadata),
  deleteFile: (fileId: string) => Base44Service.deleteFile(fileId),
  getFileDownloadUrl: (fileId: string) => Base44Service.getFileDownloadUrl(fileId)
};

export default Base44Service;