/**
 * CallLog entity model for CaseClerk AI.
 * Handles call log management, recording transcripts, and AI-powered call analysis.
 * Provides methods for call CRUD operations and integration with telephony services.
 */

import { apiClient } from '@/utils/api';

export interface CallLogData {
  id: string;
  case_id?: string;
  to_number: string;
  from_number: string;
  started_at: string;
  ended_at?: string;
  duration?: number; // in seconds
  recording_url?: string;
  transcript?: string;
  summary?: string;
  call_status: 'initiated' | 'ringing' | 'answered' | 'completed' | 'failed' | 'busy' | 'no_answer';
  call_purpose: 'client_consultation' | 'court_call' | 'witness_interview' | 'opposing_counsel' | 'other';
  notes?: string;
  action_items: string[];
  participants: {
    name: string;
    role: 'client' | 'attorney' | 'witness' | 'court_staff' | 'other';
    phone?: string;
  }[];
  ai_insights?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    key_topics: string[];
    follow_up_required: boolean;
    urgency_level: 'low' | 'medium' | 'high';
  };
  created_date: string;
  updated_date: string;
  user_id: string;
}

export interface CallFilters {
  case_id?: string;
  call_status?: string;
  call_purpose?: string;
  date_from?: string;
  date_to?: string;
}

export class CallLog {
  /**
   * Get list of call logs with optional filtering and sorting
   */
  static async list(
    sortBy: string = '-created_date',
    limit?: number,
    filters?: CallFilters
  ): Promise<CallLogData[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (limit) params.append('limit', limit.toString());
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await apiClient.get(`/api/call-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching call logs:', error);
      return [];
    }
  }

  /**
   * Get a specific call log by ID
   */
  static async getById(id: string): Promise<CallLogData | null> {
    try {
      const response = await apiClient.get(`/api/call-logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching call log:', error);
      return null;
    }
  }

  /**
   * Create a new call log entry
   */
  static async create(callData: Omit<CallLogData, 'id' | 'created_date' | 'updated_date' | 'user_id'>): Promise<CallLogData> {
    try {
      const response = await apiClient.post('/api/call-logs', callData);
      return response.data;
    } catch (error) {
      console.error('Error creating call log:', error);
      throw error;
    }
  }

  /**
   * Update an existing call log
   */
  static async update(id: string, callData: Partial<CallLogData>): Promise<CallLogData> {
    try {
      const response = await apiClient.put(`/api/call-logs/${id}`, callData);
      return response.data;
    } catch (error) {
      console.error('Error updating call log:', error);
      throw error;
    }
  }

  /**
   * Delete a call log
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/call-logs/${id}`);
    } catch (error) {
      console.error('Error deleting call log:', error);
      throw error;
    }
  }

  /**
   * Get call logs for a specific case
   */
  static async getByCaseId(caseId: string): Promise<CallLogData[]> {
    return this.list('-created_date', undefined, { case_id: caseId });
  }

  /**
   * Initiate a new call
   */
  static async initiateCall(toNumber: string, caseId?: string, purpose?: string): Promise<{
    call_id: string;
    status: string;
  }> {
    try {
      const response = await apiClient.post('/api/call-logs/initiate', {
        to_number: toNumber,
        case_id: caseId,
        call_purpose: purpose
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  }

  /**
   * End an active call
   */
  static async endCall(callId: string): Promise<void> {
    try {
      await apiClient.post(`/api/call-logs/${callId}/end`);
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }

  /**
   * Get call transcript
   */
  static async getTranscript(id: string): Promise<string | null> {
    try {
      const response = await apiClient.get(`/api/call-logs/${id}/transcript`);
      return response.data.transcript;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return null;
    }
  }

  /**
   * Generate AI summary for a call
   */
  static async generateSummary(id: string): Promise<string> {
    try {
      const response = await apiClient.post(`/api/call-logs/${id}/summarize`);
      return response.data.summary;
    } catch (error) {
      console.error('Error generating call summary:', error);
      throw error;
    }
  }

  /**
   * Get recent call logs
   */
  static async getRecent(limit: number = 10): Promise<CallLogData[]> {
    return this.list('-created_date', limit);
  }

  /**
   * Search call logs by content
   */
  static async search(query: string): Promise<CallLogData[]> {
    try {
      const response = await apiClient.get(`/api/call-logs/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching call logs:', error);
      return [];
    }
  }

  /**
   * Get call statistics
   */
  static async getStats(): Promise<{
    total_calls: number;
    total_duration: number;
    completed_calls: number;
    failed_calls: number;
    average_duration: number;
  }> {
    try {
      const response = await apiClient.get('/api/call-logs/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching call stats:', error);
      return {
        total_calls: 0,
        total_duration: 0,
        completed_calls: 0,
        failed_calls: 0,
        average_duration: 0
      };
    }
  }
}