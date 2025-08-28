/**
 * Request logging middleware for CaseClerk AI backend.
 * Logs all incoming requests with timing, user info, and response status.
 * Provides structured logging for monitoring and debugging.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  console.log(`📥 ${timestamp} ${req.method} ${req.url} - ${req.ip}`);

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  
  res.end = function(chunk?: any, encoding?: any): any {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    
    console.log(
      `📤 ${new Date().toISOString()} ${req.method} ${req.url} - ${statusCode} ${statusEmoji} - ${duration}ms`
    );

    // Log additional info for errors
    if (statusCode >= 400) {
      console.log(`   User: ${(req as any).user?.id || 'anonymous'}`);
      console.log(`   Body: ${JSON.stringify(req.body)}`);
    }

    return originalEnd(chunk, encoding);
  };

  next();
};