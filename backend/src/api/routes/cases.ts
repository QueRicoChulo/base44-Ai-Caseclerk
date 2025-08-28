/**
 * Cases API routes for CaseClerk AI backend.
 * Handles CRUD operations for legal cases with Base44 integration.
 * Provides endpoints for case management, search, and statistics.
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { base44Api } from '../../services/base44';

const router = Router();

interface CaseData {
  id?: string;
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
  created_date?: string;
  updated_date?: string;
  user_id?: string;
}

// Mock data for development
const mockCases: CaseData[] = [
  {
    id: '1',
    case_number: '2024-CV-001234',
    title: 'Smith vs. Johnson Contract Dispute',
    plaintiff: 'John Smith',
    defendant: 'Jane Johnson',
    jurisdiction: 'Superior Court of California',
    status: 'active',
    case_type: 'civil',
    priority: 'medium',
    tags: ['contract', 'business'],
    next_hearing: '2024-02-15T10:00:00Z',
    summary: 'Contract dispute regarding software development agreement',
    created_date: '2024-01-15T10:00:00Z',
    updated_date: '2024-01-20T14:30:00Z',
    user_id: '1'
  },
  {
    id: '2',
    case_number: '2024-CR-005678',
    title: 'State vs. Williams DUI Case',
    plaintiff: 'State of California',
    defendant: 'Robert Williams',
    jurisdiction: 'Municipal Court',
    status: 'pending',
    case_type: 'criminal',
    priority: 'high',
    tags: ['dui', 'criminal'],
    next_hearing: '2024-02-10T09:00:00Z',
    summary: 'DUI case with blood alcohol level of 0.12',
    created_date: '2024-01-10T08:00:00Z',
    updated_date: '2024-01-18T16:45:00Z',
    user_id: '1'
  }
];

/**
 * GET /api/cases
 * Get list of cases with optional filtering and sorting
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    sort = '-updated_date',
    limit,
    status,
    case_type,
    priority,
    search
  } = req.query;

  let cases = [...mockCases];

  // Apply filters
  if (status && status !== 'all') {
    cases = cases.filter(c => c.status === status);
  }

  if (case_type && case_type !== 'all') {
    cases = cases.filter(c => c.case_type === case_type);
  }

  if (priority && priority !== 'all') {
    cases = cases.filter(c => c.priority === priority);
  }

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    cases = cases.filter(c =>
      c.case_number?.toLowerCase().includes(searchTerm) ||
      c.title?.toLowerCase().includes(searchTerm) ||
      c.plaintiff?.toLowerCase().includes(searchTerm) ||
      c.defendant?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (sort === '-updated_date') {
    cases.sort((a, b) => new Date(b.updated_date!).getTime() - new Date(a.updated_date!).getTime());
  } else if (sort === 'updated_date') {
    cases.sort((a, b) => new Date(a.updated_date!).getTime() - new Date(b.updated_date!).getTime());
  }

  // Apply limit
  if (limit) {
    cases = cases.slice(0, parseInt(limit as string));
  }

  res.json({
    success: true,
    data: cases,
    total: cases.length
  });
}));

/**
 * GET /api/cases/:id
 * Get specific case by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const case_item = mockCases.find(c => c.id === id);

  if (!case_item) {
    throw createError('Case not found', 404, 'CASE_NOT_FOUND');
  }

  res.json({
    success: true,
    data: case_item
  });
}));

/**
 * POST /api/cases
 * Create new case
 */
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const caseData: CaseData = req.body;

  // Validate required fields
  if (!caseData.case_number || !caseData.title) {
    throw createError('Case number and title are required', 400, 'MISSING_REQUIRED_FIELDS');
  }

  // Check if case number already exists
  const existingCase = mockCases.find(c => c.case_number === caseData.case_number);
  if (existingCase) {
    throw createError('Case number already exists', 409, 'DUPLICATE_CASE_NUMBER');
  }

  // Create new case
  const newCase: CaseData = {
    ...caseData,
    id: Date.now().toString(),
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    user_id: req.user?.id || '1'
  };

  mockCases.push(newCase);

  res.status(201).json({
    success: true,
    data: newCase,
    message: 'Case created successfully'
  });
}));

/**
 * PUT /api/cases/:id
 * Update existing case
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates: Partial<CaseData> = req.body;

  const caseIndex = mockCases.findIndex(c => c.id === id);

  if (caseIndex === -1) {
    throw createError('Case not found', 404, 'CASE_NOT_FOUND');
  }

  // Update case
  mockCases[caseIndex] = {
    ...mockCases[caseIndex],
    ...updates,
    updated_date: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockCases[caseIndex],
    message: 'Case updated successfully'
  });
}));

/**
 * DELETE /api/cases/:id
 * Delete case
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const caseIndex = mockCases.findIndex(c => c.id === id);

  if (caseIndex === -1) {
    throw createError('Case not found', 404, 'CASE_NOT_FOUND');
  }

  mockCases.splice(caseIndex, 1);

  res.json({
    success: true,
    message: 'Case deleted successfully'
  });
}));

/**
 * GET /api/cases/search
 * Search cases by text query
 */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    throw createError('Search query required', 400, 'MISSING_QUERY');
  }

  const searchTerm = (q as string).toLowerCase();
  const results = mockCases.filter(c =>
    c.case_number?.toLowerCase().includes(searchTerm) ||
    c.title?.toLowerCase().includes(searchTerm) ||
    c.plaintiff?.toLowerCase().includes(searchTerm) ||
    c.defendant?.toLowerCase().includes(searchTerm) ||
    c.summary?.toLowerCase().includes(searchTerm)
  );

  res.json({
    success: true,
    data: results,
    total: results.length,
    query: q
  });
}));

/**
 * GET /api/cases/stats
 * Get case statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = {
    total: mockCases.length,
    active: mockCases.filter(c => c.status === 'active').length,
    pending: mockCases.filter(c => c.status === 'pending').length,
    closed: mockCases.filter(c => c.status === 'closed').length,
    urgent: mockCases.filter(c => c.priority === 'urgent').length,
    by_type: {
      civil: mockCases.filter(c => c.case_type === 'civil').length,
      criminal: mockCases.filter(c => c.case_type === 'criminal').length,
      family: mockCases.filter(c => c.case_type === 'family').length,
      probate: mockCases.filter(c => c.case_type === 'probate').length,
      bankruptcy: mockCases.filter(c => c.case_type === 'bankruptcy').length,
      administrative: mockCases.filter(c => c.case_type === 'administrative').length
    }
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router;