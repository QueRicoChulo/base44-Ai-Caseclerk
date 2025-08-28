/**
 * Call Logs API routes for CaseClerk AI backend.
 * Handles call log management, recording transcripts, and AI-powered call analysis.
 * Provides endpoints for call CRUD operations and integration with telephony services.
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();

interface CallLogData {
  id: string;
  case_id?: string;
  to_number: string;
  from_number: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
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

// Mock call logs data
const mockCallLogs: CallLogData[] = [
  {
    id: '1',
    case_id: '1',
    to_number: '+15551234567',
    from_number: '+15559876543',
    started_at: '2024-01-20T14:00:00Z',
    ended_at: '2024-01-20T14:15:00Z',
    duration: 900, // 15 minutes in seconds
    recording_url: '/recordings/call-1-20240120.mp3',
    transcript: 'Attorney: Good afternoon, Mr. Smith. I wanted to discuss the contract dispute case...',
    summary: 'Discussed contract dispute details with client. Client provided additional evidence.',
    call_status: 'completed',
    call_purpose: 'client_consultation',
    notes: 'Client mentioned new witness who saw the contract signing',
    action_items: [
      'Contact new witness for statement',
      'Review additional contract evidence',
      'Schedule follow-up meeting'
    ],
    participants: [
      {
        name: 'John Smith',
        role: 'client',
        phone: '+15551234567'
      },
      {
        name: 'Demo Attorney',
        role: 'attorney',
        phone: '+15559876543'
      }
    ],
    ai_insights: {
      sentiment: 'positive',
      key_topics: ['contract dispute', 'witness testimony', 'evidence'],
      follow_up_required: true,
      urgency_level: 'medium'
    },
    created_date: '2024-01-20T14:00:00Z',
    updated_date: '2024-01-20T14:16:00Z',
    user_id: '1'
  },
  {
    id: '2',
    case_id: '2',
    to_number: '+15555551234',
    from_number: '+15559876543',
    started_at: '2024-01-18T10:30:00Z',
    ended_at: '2024-01-18T10:45:00Z',
    duration: 900,
    call_status: 'completed',
    call_purpose: 'client_consultation',
    notes: 'Initial consultation for DUI case',
    action_items: [
      'Request police report',
      'Schedule DMV hearing',
      'Gather character references'
    ],
    participants: [
      {
        name: 'Robert Williams',
        role: 'client',
        phone: '+15555551234'
      }
    ],
    ai_insights: {
      sentiment: 'neutral',
      key_topics: ['DUI', 'police report', 'DMV hearing'],
      follow_up_required: true,
      urgency_level: 'high'
    },
    created_date: '2024-01-18T10:30:00Z',
    updated_date: '2024-01-18T10:46:00Z',
    user_id: '1'
  }
];

/**
 * GET /api/call-logs
 * Get list of call logs with optional filtering
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    sort = '-created_date',
    limit,
    case_id,
    call_status,
    call_purpose,
    date_from,
    date_to
  } = req.query;

  let callLogs = [...mockCallLogs];

  // Apply filters
  if (case_id) {
    callLogs = callLogs.filter(c => c.case_id === case_id);
  }

  if (call_status && call_status !== 'all') {
    callLogs = callLogs.filter(c => c.call_status === call_status);
  }

  if (call_purpose && call_purpose !== 'all') {
    callLogs = callLogs.filter(c => c.call_purpose === call_purpose);
  }

  if (date_from) {
    callLogs = callLogs.filter(c => new Date(c.started_at) >= new Date(date_from as string));
  }

  if (date_to) {
    callLogs = callLogs.filter(c => new Date(c.started_at) <= new Date(date_to as string));
  }

  // Apply sorting
  if (sort === '-created_date') {
    callLogs.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
  } else if (sort === 'created_date') {
    callLogs.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
  }

  // Apply limit
  if (limit) {
    callLogs = callLogs.slice(0, parseInt(limit as string));
  }

  res.json({
    success: true,
    data: callLogs,
    total: callLogs.length
  });
}));

/**
 * GET /api/call-logs/:id
 * Get specific call log by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const callLog = mockCallLogs.find(c => c.id === id);

  if (!callLog) {
    throw createError('Call log not found', 404, 'CALL_LOG_NOT_FOUND');
  }

  res.json({
    success: true,
    data: callLog
  });
}));

/**
 * POST /api/call-logs
 * Create new call log entry
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const callData: Omit<CallLogData, 'id' | 'created_date' | 'updated_date' | 'user_id'> = req.body;

  // Validate required fields
  if (!callData.to_number || !callData.from_number || !callData.started_at) {
    throw createError('To number, from number, and start time are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Create new call log
  const newCallLog: CallLogData = {
    ...callData,
    id: Date.now().toString(),
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    user_id: req.user?.id || '1'
  };

  mockCallLogs.push(newCallLog);

  res.status(201).json({
    success: true,
    data: newCallLog,
    message: 'Call log created successfully'
  });
}));

/**
 * PUT /api/call-logs/:id
 * Update existing call log
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const callLogIndex = mockCallLogs.findIndex(c => c.id === id);

  if (callLogIndex === -1) {
    throw createError('Call log not found', 404, 'CALL_LOG_NOT_FOUND');
  }

  // Update call log
  mockCallLogs[callLogIndex] = {
    ...mockCallLogs[callLogIndex],
    ...updates,
    updated_date: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockCallLogs[callLogIndex],
    message: 'Call log updated successfully'
  });
}));

/**
 * DELETE /api/call-logs/:id
 * Delete call log
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const callLogIndex = mockCallLogs.findIndex(c => c.id === id);

  if (callLogIndex === -1) {
    throw createError('Call log not found', 404, 'CALL_LOG_NOT_FOUND');
  }

  mockCallLogs.splice(callLogIndex, 1);

  res.json({
    success: true,
    message: 'Call log deleted successfully'
  });
}));

/**
 * POST /api/call-logs/initiate
 * Initiate a new call
 */
router.post('/initiate', asyncHandler(async (req: Request, res: Response) => {
  const { to_number, case_id, call_purpose = 'other' } = req.body;

  if (!to_number) {
    throw createError('To number is required', 400, 'MISSING_TO_NUMBER');
  }

  // Create initial call log entry
  const newCall: CallLogData = {
    id: Date.now().toString(),
    case_id,
    to_number,
    from_number: '+15559876543', // Default office number
    started_at: new Date().toISOString(),
    call_status: 'initiated',
    call_purpose,
    notes: '',
    action_items: [],
    participants: [],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    user_id: req.user?.id || '1'
  };

  mockCallLogs.push(newCall);

  // Simulate call initiation
  setTimeout(() => {
    const callIndex = mockCallLogs.findIndex(c => c.id === newCall.id);
    if (callIndex !== -1) {
      mockCallLogs[callIndex].call_status = 'ringing';
      mockCallLogs[callIndex].updated_date = new Date().toISOString();
    }
  }, 1000);

  res.status(201).json({
    success: true,
    data: {
      call_id: newCall.id,
      status: 'initiated'
    },
    message: 'Call initiated successfully'
  });
}));

/**
 * POST /api/call-logs/:id/end
 * End an active call
 */
router.post('/:id/end', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const callLogIndex = mockCallLogs.findIndex(c => c.id === id);

  if (callLogIndex === -1) {
    throw createError('Call log not found', 404, 'CALL_LOG_NOT_FOUND');
  }

  const callLog = mockCallLogs[callLogIndex];

  // Calculate duration if not set
  if (!callLog.ended_at) {
    const endTime = new Date();
    const startTime = new Date(callLog.started_at);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    mockCallLogs[callLogIndex] = {
      ...callLog,
      ended_at: endTime.toISOString(),
      duration,
      call_status: 'completed',
      updated_date: new Date().toISOString()
    };
  }

  res.json({
    success: true,
    data: mockCallLogs[callLogIndex],
    message: 'Call ended successfully'
  });
}));

/**
 * GET /api/call-logs/:id/transcript
 * Get call transcript
 */
router.get('/:id/transcript', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const callLog = mockCallLogs.find(c => c.id === id);

  if (!callLog) {
    throw createError('Call log not found', 404, 'CALL_LOG_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      transcript: callLog.transcript || 'Transcript not available',
      call_id: id,
      duration: callLog.duration
    }
  });
}));

/**
 * POST /api/call-logs/:id/summarize
 * Generate AI summary for a call
 */
router.post('/:id/summarize', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const callLogIndex = mockCallLogs.findIndex(c => c.id === id);

  if (callLogIndex === -1) {
    throw createError('Call log not found', 404, 'CALL_LOG_NOT_FOUND');
  }

  // Simulate AI summary generation
  const aiSummary = 'AI-generated summary: This call discussed case details, client concerns, and next steps for legal proceedings.';
  
  mockCallLogs[callLogIndex].summary = aiSummary;
  mockCallLogs[callLogIndex].updated_date = new Date().toISOString();

  res.json({
    success: true,
    data: {
      summary: aiSummary,
      call_id: id
    },
    message: 'AI summary generated successfully'
  });
}));

/**
 * GET /api/call-logs/search
 * Search call logs by content
 */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    throw createError('Search query required', 400, 'MISSING_QUERY');
  }

  const searchTerm = (q as string).toLowerCase();
  const results = mockCallLogs.filter(c =>
    c.notes?.toLowerCase().includes(searchTerm) ||
    c.summary?.toLowerCase().includes(searchTerm) ||
    c.transcript?.toLowerCase().includes(searchTerm) ||
    c.participants.some(p => p.name.toLowerCase().includes(searchTerm))
  );

  res.json({
    success: true,
    data: results,
    total: results.length,
    query: q
  });
}));

/**
 * GET /api/call-logs/stats
 * Get call statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const totalDuration = mockCallLogs.reduce((sum, call) => sum + (call.duration || 0), 0);
  const completedCalls = mockCallLogs.filter(c => c.call_status === 'completed');

  const stats = {
    total_calls: mockCallLogs.length,
    total_duration: totalDuration,
    completed_calls: completedCalls.length,
    failed_calls: mockCallLogs.filter(c => c.call_status === 'failed').length,
    average_duration: completedCalls.length > 0 ? Math.round(totalDuration / completedCalls.length) : 0,
    by_purpose: {
      client_consultation: mockCallLogs.filter(c => c.call_purpose === 'client_consultation').length,
      court_call: mockCallLogs.filter(c => c.call_purpose === 'court_call').length,
      witness_interview: mockCallLogs.filter(c => c.call_purpose === 'witness_interview').length,
      opposing_counsel: mockCallLogs.filter(c => c.call_purpose === 'opposing_counsel').length,
      other: mockCallLogs.filter(c => c.call_purpose === 'other').length
    }
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router;