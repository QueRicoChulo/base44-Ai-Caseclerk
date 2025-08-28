/**
 * CaseClerk AI Backend Server Entry Point
 * Express.js server with TypeScript, authentication, and API routes
 * Handles all backend operations for the CaseClerk AI application
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './api/routes/auth';
import casesRoutes from './api/routes/cases';
import documentsRoutes from './api/routes/documents';
import usersRoutes from './api/routes/users';
import callLogsRoutes from './api/routes/callLogs';
import calendarEventsRoutes from './api/routes/calendarEvents';
import aiRoutes from './api/routes/ai';

// Import middleware
import { errorHandler } from './api/middleware/errorHandler';
import { authMiddleware } from './api/middleware/auth';
import { rateLimiter } from './api/middleware/rateLimiter';
import { requestLogger } from './api/middleware/logger';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://caseclerk.ai', 'https://www.caseclerk.ai']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/cases', authMiddleware, casesRoutes);
app.use('/api/documents', authMiddleware, documentsRoutes);
app.use('/api/call-logs', authMiddleware, callLogsRoutes);
app.use('/api/calendar-events', authMiddleware, calendarEventsRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/out')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/out/index.html'));
  });
}

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CaseClerk AI Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
  }
});

export default app;