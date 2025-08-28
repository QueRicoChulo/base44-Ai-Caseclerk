/**
 * CalendarEvent entity model for CaseClerk AI.
 * Handles calendar and event management for legal practice scheduling.
 * Provides methods for event CRUD operations, reminders, and court date tracking.
 */

import { apiClient } from '@/utils/api';

export interface CalendarEventData {
  id: string;
  case_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  event_type: 'hearing' | 'deposition' | 'meeting' | 'deadline' | 'court_date' | 'consultation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  attendees: {
    name: string;
    email?: string;
    role: 'client' | 'attorney' | 'judge' | 'witness' | 'opposing_counsel' | 'other';
    required: boolean;
  }[];
  reminders: {
    time_before: number; // minutes before event
    method: 'email' | 'sms' | 'notification';
    sent: boolean;
  }[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: string;
    count?: number;
  };
  notes?: string;
  documents: string[]; // document IDs related to this event
  created_date: string;
  updated_date: string;
  user_id: string;
}

export interface EventFilters {
  case_id?: string;
  event_type?: string;
  priority?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export class CalendarEvent {
  /**
   * Get list of calendar events with optional filtering and sorting
   */
  static async list(
    sortBy: string = '-start_time',
    limit?: number,
    filters?: EventFilters
  ): Promise<CalendarEventData[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (limit) params.append('limit', limit.toString());
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await apiClient.get(`/api/calendar-events?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  /**
   * Get a specific calendar event by ID
   */
  static async getById(id: string): Promise<CalendarEventData | null> {
    try {
      const response = await apiClient.get(`/api/calendar-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar event:', error);
      return null;
    }
  }

  /**
   * Create a new calendar event
   */
  static async create(eventData: Omit<CalendarEventData, 'id' | 'created_date' | 'updated_date' | 'user_id'>): Promise<CalendarEventData> {
    try {
      const response = await apiClient.post('/api/calendar-events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   */
  static async update(id: string, eventData: Partial<CalendarEventData>): Promise<CalendarEventData> {
    try {
      const response = await apiClient.put(`/api/calendar-events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/calendar-events/${id}`);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * Get events for a specific case
   */
  static async getByCaseId(caseId: string): Promise<CalendarEventData[]> {
    return this.list('-start_time', undefined, { case_id: caseId });
  }

  /**
   * Get upcoming events
   */
  static async getUpcoming(limit: number = 10): Promise<CalendarEventData[]> {
    const now = new Date().toISOString();
    return this.list('start_time', limit, { date_from: now });
  }

  /**
   * Get events for a specific date range
   */
  static async getByDateRange(startDate: string, endDate: string): Promise<CalendarEventData[]> {
    return this.list('start_time', undefined, {
      date_from: startDate,
      date_to: endDate
    });
  }

  /**
   * Get today's events
   */
  static async getToday(): Promise<CalendarEventData[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    
    return this.getByDateRange(startOfDay, endOfDay);
  }

  /**
   * Get this week's events
   */
  static async getThisWeek(): Promise<CalendarEventData[]> {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return this.getByDateRange(startOfWeek.toISOString(), endOfWeek.toISOString());
  }

  /**
   * Get overdue events
   */
  static async getOverdue(): Promise<CalendarEventData[]> {
    const now = new Date().toISOString();
    return this.list('-start_time', undefined, {
      date_to: now,
      status: 'scheduled'
    });
  }

  /**
   * Get high priority events
   */
  static async getHighPriority(): Promise<CalendarEventData[]> {
    return this.list('start_time', undefined, {
      priority: 'high'
    });
  }

  /**
   * Get critical events
   */
  static async getCritical(): Promise<CalendarEventData[]> {
    return this.list('start_time', undefined, {
      priority: 'critical'
    });
  }

  /**
   * Reschedule an event
   */
  static async reschedule(id: string, newStartTime: string, newEndTime: string): Promise<CalendarEventData> {
    try {
      const response = await apiClient.put(`/api/calendar-events/${id}/reschedule`, {
        start_time: newStartTime,
        end_time: newEndTime,
        status: 'rescheduled'
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling event:', error);
      throw error;
    }
  }

  /**
   * Mark event as completed
   */
  static async markCompleted(id: string): Promise<void> {
    try {
      await this.update(id, { status: 'completed' });
    } catch (error) {
      console.error('Error marking event as completed:', error);
      throw error;
    }
  }

  /**
   * Cancel an event
   */
  static async cancel(id: string, reason?: string): Promise<void> {
    try {
      await this.update(id, { 
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      });
    } catch (error) {
      console.error('Error cancelling event:', error);
      throw error;
    }
  }

  /**
   * Search events by text
   */
  static async search(query: string): Promise<CalendarEventData[]> {
    try {
      const response = await apiClient.get(`/api/calendar-events/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching calendar events:', error);
      return [];
    }
  }

  /**
   * Get calendar statistics
   */
  static async getStats(): Promise<{
    total_events: number;
    upcoming_events: number;
    overdue_events: number;
    completed_events: number;
    critical_events: number;
  }> {
    try {
      const response = await apiClient.get('/api/calendar-events/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar stats:', error);
      return {
        total_events: 0,
        upcoming_events: 0,
        overdue_events: 0,
        completed_events: 0,
        critical_events: 0
      };
    }
  }
}