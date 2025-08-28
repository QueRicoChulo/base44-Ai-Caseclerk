/**
 * Document entity model for CaseClerk AI.
 * Handles document management, file uploads, and AI processing integration.
 * Provides methods for document CRUD operations and file processing workflows.
 */

import { apiClient } from '@/utils/api';

export interface DocumentData {
  id: string;
  case_id?: string;
  original_name: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  document_type: 'motion' | 'order' | 'complaint' | 'discovery' | 'correspondence' | 'other';
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  ai_summary?: string;
  extracted_text?: string;
  tags: string[];
  metadata: Record<string, any>;
  created_date: string;
  updated_date: string;
  user_id: string;
}

export interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'review' | 'completed' | 'failed';
  error?: string;
}

export class Document {
  /**
   * Get list of documents with optional filtering
   */
  static async list(
    sortBy: string = '-created_date',
    limit?: number,
    caseId?: string
  ): Promise<DocumentData[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (limit) params.append('limit', limit.toString());
      if (caseId) params.append('case_id', caseId);

      const response = await apiClient.get(`/api/documents?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  /**
   * Get a specific document by ID
   */
  static async getById(id: string): Promise<DocumentData | null> {
    try {
      const response = await apiClient.get(`/api/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  /**
   * Upload a new document with progress tracking
   */
  static async upload(
    file: File,
    caseId?: string,
    documentType?: string,
    onProgress?: (progress: number) => void
  ): Promise<DocumentData> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (caseId) formData.append('case_id', caseId);
      if (documentType) formData.append('document_type', documentType);

      const response = await apiClient.post('/api/documents/upload', formData, {
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
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Update document metadata
   */
  static async update(id: string, updates: Partial<DocumentData>): Promise<DocumentData> {
    try {
      const response = await apiClient.put(`/api/documents/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/documents/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get documents for a specific case
   */
  static async getByCaseId(caseId: string): Promise<DocumentData[]> {
    return this.list('-created_date', undefined, caseId);
  }

  /**
   * Search documents by text content
   */
  static async search(query: string): Promise<DocumentData[]> {
    try {
      const response = await apiClient.get(`/api/documents/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  /**
   * Get document processing status
   */
  static async getProcessingStatus(id: string): Promise<{
    status: string;
    progress: number;
    ai_summary?: string;
    extracted_text?: string;
  }> {
    try {
      const response = await apiClient.get(`/api/documents/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document status:', error);
      return { status: 'failed', progress: 0 };
    }
  }

  /**
   * Trigger AI processing for a document
   */
  static async processWithAI(id: string): Promise<void> {
    try {
      await apiClient.post(`/api/documents/${id}/process`);
    } catch (error) {
      console.error('Error processing document with AI:', error);
      throw error;
    }
  }

  /**
   * Get document download URL
   */
  static async getDownloadUrl(id: string): Promise<string> {
    try {
      const response = await apiClient.get(`/api/documents/${id}/download`);
      return response.data.url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  /**
   * Get recent documents
   */
  static async getRecent(limit: number = 10): Promise<DocumentData[]> {
    return this.list('-created_date', limit);
  }

  /**
   * Get document statistics
   */
  static async getStats(): Promise<{
    total: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    try {
      const response = await apiClient.get('/api/documents/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching document stats:', error);
      return {
        total: 0,
        processing: 0,
        completed: 0,
        failed: 0
      };
    }
  }
}