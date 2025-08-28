/**
 * Rate limiting middleware for CaseClerk AI backend.
 * Prevents abuse and ensures fair usage of API endpoints.
 * Configurable limits for different endpoint types.
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Basic rate limiter implementation
 */
export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  // Default limits
  let maxRequests = 100; // requests per window
  let windowMs = 15 * 60 * 1000; // 15 minutes
  
  // Adjust limits based on endpoint
  if (req.path.includes('/auth/login')) {
    maxRequests = 5;
    windowMs = 15 * 60 * 1000; // 15 minutes
  } else if (req.path.includes('/upload')) {
    maxRequests = 10;
    windowMs = 60 * 1000; // 1 minute
  } else if (req.path.includes('/ai/')) {
    maxRequests = 20;
    windowMs = 60 * 1000; // 1 minute
  }

  const key = `${clientId}:${req.path}`;
  const record = store[key];

  if (!record || now > record.resetTime) {
    // First request or window expired
    store[key] = {
      count: 1,
      resetTime: now + windowMs
    };
    
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - 1).toString(),
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    });
    
    next();
    return;
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    });
    return;
  }

  // Increment counter
  record.count++;
  
  res.set({
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': (maxRequests - record.count).toString(),
    'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
  });

  next();
};

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000); // Clean up every 5 minutes