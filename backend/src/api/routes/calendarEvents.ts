/**
 * Calendar Events API routes for CaseClerk AI backend.
 * Handles calendar and event management for legal practice scheduling.
 * Provides endpoints for event CRUD operations, reminders, and court date tracking.
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();

interface CalendarEventData {
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
    time_before: number;
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
  documents: string[];
  created_date: string;
  updated_date: string;
  user_id: string;
}

// Mock calendar events data
const mockEvents: CalendarEventData[] = [
  {
    id: '1',
    case_id: '1',
    title: 'Contract Dispute Hearing',
    description: 'Initial hearing for Smith vs. Johnson contract dispute',
    start_time: '2024-02-15T10:00:00Z',
    end_time: '2024-02-15T11:00:00Z',
    location: 'Superior Court of California, Room 101',
    event_type: 'hearing',
    priority: 'high',
    status: 'scheduled',
    attendees: [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        role: 'client',
        required: true
      },
      {
        name: 'Judge Williams',
        role: 'judge',
        required: true
      }
    ],
    reminders: [
      {
        time_before: 1440, // 24 hours
        method: 'email',
        sent: false
      },
      {
        time_before: 60, // 1 hour
        method: 'notification',
        sent: false
      }
    ],
    notes: 'Bring all contract documents and evidence',
    documents: ['1'],
    created_date: '2024-01-15T10:00:00Z',
    updated_date: '2024-01-15T10:00:00Z',
    user_id: '1'
  },
  {
    id: '2',
    case_id: '2',
    title: 'Client Consultation - Williams DUI',
    description: 'Initial consultation with Robert Williams regarding DUI case',
    start_time: '2024-02-12T14:00:00Z',
    end_time: '2024-02-12T15:00:00Z',
    location: 'Law Office Conference Room A',
    event_type: 'consultation',
    priority: 'medium',
    status: 'confirmed',
    attendees: [
      {
        name: 'Robert Williams',
        email: 'robert.williams@email.com',
        role: 'client',
        required: true
      }
    ],
    reminders: [
      {
        time_before: 60,
        method: 'email',
        sent: false
      }
    ],
    notes: 'Review police report and breathalyzer results',
    documents: [],
    created_date: '2024-01-10T08:00:00Z',
    updated_date: '2024-01-18T16:45:00Z',
    user_id: '1'
  }
];

/**
 * GET /api/calendar-events
 * Get list of calendar events with optional filtering
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    sort = '-start_time',
    limit,
    case_id,
    event_type,
    priority,
    status,
    date_from,
    date_to
  } = req.query;

  let events = [...mockEvents];

  // Apply filters
  if (case_id) {
    events = events.filter(e => e.case_id === case_id);
  }

  if (event_type && event_type !== 'all') {
    events = events.filter(e => e.event_type === event_type);
  }

  if (priority && priority !== 'all') {
    events = events.filter(e => e.priority === priority);
  }

  if (status && status !== 'all') {
    events = events.filter(e => e.status === status);
  }

  if (date_from) {
    events = events.filter(e => new Date(e.start_time) >= new Date(date_from as string));
  }

  if (date_to) {
    events = events.filter(e => new Date(e.start_time) <= new Date(date_to as string));
  }

  // Apply sorting
  if (sort === '-start_time') {
    events.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  } else if (sort === 'start_time') {
    events.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }

  // Apply limit
  if (limit) {
    events = events.slice(0, parseInt(limit as string));
  }

  res.json({
    success: true,
    data: events,
    total: events.length
  });
}));

/**
 * GET /api/calendar-events/:id
 * Get specific calendar event by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    throw createError('Calendar event not found', 404, 'EVENT_NOT_FOUND');
  }

  res.json({
    success: true,
    data: event
  });
}));

/**
 * POST /api/calendar-events
 * Create new calendar event
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const eventData: Omit<CalendarEventData, 'id' | 'created_date' | 'updated_date' | 'user_id'> = req.body;

  // Validate required fields
  if (!eventData.title || !eventData.start_time || !eventData.end_time) {
    throw createError('Title, start time, and end time are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Validate date range
  if (new Date(eventData.start_time) >= new Date(eventData.end_time)) {
    throw createError('End time must be after start time', 400, 'INVALID_DATE_RANGE');
  }

  // Create new event
  const newEvent: CalendarEventData = {
    ...eventData,
    id: Date.now().toString(),
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    user_id: req.user?.id || '1'
  };

  mockEvents.push(newEvent);

  res.status(201).json({
    success: true,
    data: newEvent,
    message: 'Calendar event created successfully'
  });
}));

/**
 * PUT /api/calendar-events/:id
 * Update existing calendar event
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const eventIndex = mockEvents.findIndex(e => e.id === id);

  if (eventIndex === -1) {
    throw createError('Calendar event not found', 404, 'EVENT_NOT_FOUND');
  }

  // Validate date range if dates are being updated
  if (updates.start_time || updates.end_time) {
    const startTime = updates.start_time || mockEvents[eventIndex].start_time;
    const endTime = updates.end_time || mockEvents[eventIndex].end_time;
    
    if (new Date(startTime) >= new Date(endTime)) {
      throw createError('End time must be after start time', 400, 'INVALID_DATE_RANGE');
    }
  }

  // Update event
  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    ...updates,
    updated_date: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockEvents[eventIndex],
    message: 'Calendar event updated successfully'
  });
}));

/**
 * DELETE /api/calendar-events/:id
 * Delete calendar event
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const eventIndex = mockEvents.findIndex(e => e.id === id);

  if (eventIndex === -1) {
    throw createError('Calendar event not found', 404, 'EVENT_NOT_FOUND');
  }

  mockEvents.splice(eventIndex, 1);

  res.json({
    success: true,
    message: 'Calendar event deleted successfully'
  });
}));

/**
 * PUT /api/calendar-events/:id/reschedule
 * Reschedule an event
 */
router.put('/:id/reschedule', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    throw createError('Start time and end time are required', 400, 'MISSING_TIMES');
  }

  const eventIndex = mockEvents.findIndex(e => e.id === id);

  if (eventIndex === -1) {
    throw createError('Calendar event not found', 404, 'EVENT_NOT_FOUND');
  }

  // Validate date range
  if (new Date(start_time) >= new Date(end_time)) {
    throw createError('End time must be after start time', 400, 'INVALID_DATE_RANGE');
  }

  // Update event
  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    start_time,
    end_time,
    status: 'rescheduled',
    updated_date: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockEvents[eventIndex],
    message: 'Event rescheduled successfully'
  });
}));

/**
 * GET /api/calendar-events/upcoming
 * Get upcoming events
 */
router.get('/upcoming', asyncHandler(async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;
  const now = new Date().toISOString();

  const upcomingEvents = mockEvents
    .filter(e => e.start_time > now && e.status !== 'cancelled')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, parseInt(limit as string));

  res.json({
    success: true,
    data: upcomingEvents,
    total: upcomingEvents.length
  });
}));

/**
 * GET /api/calendar-events/today
 * Get today's events
 */
router.get('/today', asyncHandler(async (req: Request, res: Response) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const todayEvents = mockEvents
    .filter(e => e.start_time >= startOfDay && e.start_time <= endOfDay)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  res.json({
    success: true,
    data: todayEvents,
    total: todayEvents.length
  });
}));

/**
 * GET /api/calendar-events/stats
 * Get calendar statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const upcomingEvents = mockEvents.filter(e => new Date(e.start_time) > now);
  const overdueEvents = mockEvents.filter(e => 
    new Date(e.start_time) < now && e.status === 'scheduled'
  );

  const stats = {
    total_events: mockEvents.length,
    upcoming_events: upcomingEvents.length,
    overdue_events: overdueEvents.length,
    completed_events: mockEvents.filter(e => e.status === 'completed').length,
    critical_events: mockEvents.filter(e => e.priority === 'critical').length,
    by_type: {
      hearing: mockEvents.filter(e => e.event_type === 'hearing').length,
      deposition: mockEvents.filter(e => e.event_type === 'deposition').length,
      meeting: mockEvents.filter(e => e.event_type === 'meeting').length,
      deadline: mockEvents.filter(e => e.event_type === 'deadline').length,
      court_date: mockEvents.filter(e => e.event_type === 'court_date').length,
      consultation: mockEvents.filter(e => e.event_type === 'consultation').length,
      other: mockEvents.filter(e => e.event_type === 'other').length
    }
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router;