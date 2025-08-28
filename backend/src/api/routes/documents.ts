/**
 * Documents API routes for CaseClerk AI backend.
 * Handles file uploads, document management, and AI processing.
 * Provides endpoints for document CRUD operations and file processing workflows.
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

interface DocumentData {
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

// Mock documents data
const mockDocuments: DocumentData[] = [
  {
    id: '1',
    case_id: '1',
    original_name: 'contract_agreement.pdf',
    file_name: 'doc-1234567890-contract_agreement.pdf',
    file_url: '/uploads/doc-1234567890-contract_agreement.pdf',
    file_size: 2048576,
    mime_type: 'application/pdf',
    document_type: 'other',
    status: 'completed',
    ai_summary: 'Software development contract between Smith and Johnson for web application development.',
    extracted_text: 'This agreement is entered into between John Smith and Jane Johnson...',
    tags: ['contract', 'software', 'development'],
    metadata: { pages: 5, word_count: 1250 },
    created_date: '2024-01-15T10:00:00Z',
    updated_date: '2024-01-15T10:30:00Z',
    user_id: '1'
  }
];

/**
 * GET /api/documents
 * Get list of documents with optional filtering
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    sort = '-created_date',
    limit,
    case_id
  } = req.query;

  let documents = [...mockDocuments];

  // Filter by case_id if provided
  if (case_id) {
    documents = documents.filter(d => d.case_id === case_id);
  }

  // Apply sorting
  if (sort === '-created_date') {
    documents.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
  }

  // Apply limit
  if (limit) {
    documents = documents.slice(0, parseInt(limit as string));
  }

  res.json({
    success: true,
    data: documents,
    total: documents.length
  });
}));

/**
 * GET /api/documents/:id
 * Get specific document by ID
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const document = mockDocuments.find(d => d.id === id);

  if (!document) {
    throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  res.json({
    success: true,
    data: document
  });
}));

/**
 * POST /api/documents/upload
 * Upload new document with AI processing
 */
router.post('/upload', upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw createError('No file uploaded', 400, 'NO_FILE');
  }

  const { case_id, document_type = 'other' } = req.body;

  // Create document record
  const newDocument: DocumentData = {
    id: Date.now().toString(),
    case_id,
    original_name: req.file.originalname,
    file_name: req.file.filename,
    file_url: `/uploads/${req.file.filename}`,
    file_size: req.file.size,
    mime_type: req.file.mimetype,
    document_type,
    status: 'completed',
    tags: [],
    metadata: {},
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    user_id: req.user?.id || '1'
  };

  // Simulate AI processing for supported file types
  if (['application/pdf', 'text/plain'].includes(req.file.mimetype)) {
    newDocument.status = 'processing';
    
    // Simulate async AI processing
    setTimeout(() => {
      newDocument.status = 'completed';
      newDocument.ai_summary = 'AI-generated summary of the document content.';
      newDocument.extracted_text = 'Extracted text from the document...';
      newDocument.tags = ['auto-generated', 'processed'];
      newDocument.updated_date = new Date().toISOString();
    }, 2000);
  }

  mockDocuments.push(newDocument);

  res.status(201).json({
    success: true,
    data: newDocument,
    message: 'Document uploaded successfully'
  });
}));

/**
 * PUT /api/documents/:id
 * Update document metadata
 */
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const documentIndex = mockDocuments.findIndex(d => d.id === id);

  if (documentIndex === -1) {
    throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  // Update document
  mockDocuments[documentIndex] = {
    ...mockDocuments[documentIndex],
    ...updates,
    updated_date: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockDocuments[documentIndex],
    message: 'Document updated successfully'
  });
}));

/**
 * DELETE /api/documents/:id
 * Delete document and file
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const documentIndex = mockDocuments.findIndex(d => d.id === id);

  if (documentIndex === -1) {
    throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  const document = mockDocuments[documentIndex];

  // Delete physical file
  const filePath = path.join(process.cwd(), 'uploads', document.file_name);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from array
  mockDocuments.splice(documentIndex, 1);

  res.json({
    success: true,
    message: 'Document deleted successfully'
  });
}));

/**
 * GET /api/documents/:id/download
 * Get document download URL
 */
router.get('/:id/download', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const document = mockDocuments.find(d => d.id === id);

  if (!document) {
    throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      url: `${req.protocol}://${req.get('host')}${document.file_url}`,
      filename: document.original_name,
      expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
    }
  });
}));

/**
 * POST /api/documents/:id/process
 * Trigger AI processing for document
 */
router.post('/:id/process', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const documentIndex = mockDocuments.findIndex(d => d.id === id);

  if (documentIndex === -1) {
    throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  // Update status to processing
  mockDocuments[documentIndex].status = 'processing';
  mockDocuments[documentIndex].updated_date = new Date().toISOString();

  // Simulate AI processing
  setTimeout(() => {
    mockDocuments[documentIndex].status = 'completed';
    mockDocuments[documentIndex].ai_summary = 'AI-generated summary after processing.';
    mockDocuments[documentIndex].extracted_text = 'Extracted and processed text content.';
    mockDocuments[documentIndex].updated_date = new Date().toISOString();
  }, 3000);

  res.json({
    success: true,
    message: 'Document processing started',
    data: mockDocuments[documentIndex]
  });
}));

/**
 * GET /api/documents/:id/status
 * Get document processing status
 */
router.get('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const document = mockDocuments.find(d => d.id === id);

  if (!document) {
    throw createError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  const progress = document.status === 'completed' ? 100 : 
                  document.status === 'processing' ? 75 : 
                  document.status === 'failed' ? 0 : 50;

  res.json({
    success: true,
    data: {
      status: document.status,
      progress,
      ai_summary: document.ai_summary,
      extracted_text: document.extracted_text
    }
  });
}));

/**
 * GET /api/documents/search
 * Search documents by content
 */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    throw createError('Search query required', 400, 'MISSING_QUERY');
  }

  const searchTerm = (q as string).toLowerCase();
  const results = mockDocuments.filter(d =>
    d.original_name.toLowerCase().includes(searchTerm) ||
    d.ai_summary?.toLowerCase().includes(searchTerm) ||
    d.extracted_text?.toLowerCase().includes(searchTerm) ||
    d.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  res.json({
    success: true,
    data: results,
    total: results.length,
    query: q
  });
}));

/**
 * GET /api/documents/stats
 * Get document statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = {
    total: mockDocuments.length,
    processing: mockDocuments.filter(d => d.status === 'processing').length,
    completed: mockDocuments.filter(d => d.status === 'completed').length,
    failed: mockDocuments.filter(d => d.status === 'failed').length,
    by_type: {
      motion: mockDocuments.filter(d => d.document_type === 'motion').length,
      order: mockDocuments.filter(d => d.document_type === 'order').length,
      complaint: mockDocuments.filter(d => d.document_type === 'complaint').length,
      discovery: mockDocuments.filter(d => d.document_type === 'discovery').length,
      correspondence: mockDocuments.filter(d => d.document_type === 'correspondence').length,
      other: mockDocuments.filter(d => d.document_type === 'other').length
    }
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router;