/**
 * Barrel export file for all CaseClerk AI entity models.
 * Provides centralized imports for all data models and their types.
 * Used throughout the application for consistent entity access.
 */

// Entity Classes
export { User } from './User';
export { Case } from './Case';
export { Document } from './Document';
export { CallLog } from './CallLog';
export { CalendarEvent } from './CalendarEvent';

// Entity Types
export type { UserProfile } from './User';
export type { CaseData, CaseFilters } from './Case';
export type { DocumentData, UploadProgress } from './Document';
export type { CallLogData, CallFilters } from './CallLog';
export type { CalendarEventData, EventFilters } from './CalendarEvent';

// Re-export commonly used types for convenience
export type EntityId = string;

export type EntityStatus = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'completed' 
  | 'cancelled' 
  | 'failed';

export type Priority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'urgent' 
  | 'critical';

export type UserRole = 
  | 'student' 
  | 'pro_per' 
  | 'paralegal' 
  | 'attorney' 
  | 'firm_admin';

export type CaseStatus = 
  | 'active' 
  | 'pending' 
  | 'closed' 
  | 'appealed' 
  | 'settled';

export type CaseType = 
  | 'civil' 
  | 'criminal' 
  | 'family' 
  | 'probate' 
  | 'bankruptcy' 
  | 'administrative';

export type DocumentType = 
  | 'motion' 
  | 'order' 
  | 'complaint' 
  | 'discovery' 
  | 'correspondence' 
  | 'other';

export type CallStatus = 
  | 'initiated' 
  | 'ringing' 
  | 'answered' 
  | 'completed' 
  | 'failed' 
  | 'busy' 
  | 'no_answer';

export type EventType = 
  | 'hearing' 
  | 'deposition' 
  | 'meeting' 
  | 'deadline' 
  | 'court_date' 
  | 'consultation' 
  | 'other';

// Common interfaces used across entities
export interface BaseEntity {
  id: string;
  created_date: string;
  updated_date: string;
  user_id: string;
}

export interface SearchFilters {
  search?: string;
  status?: string;
  priority?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Utility type for creating new entities (without system fields)
export type CreateEntity<T extends BaseEntity> = Omit<T, 'id' | 'created_date' | 'updated_date' | 'user_id'>;

// Utility type for updating entities (all fields optional except id)
export type UpdateEntity<T extends BaseEntity> = Partial<Omit<T, 'id' | 'created_date' | 'user_id'>> & {
  id: string;
};