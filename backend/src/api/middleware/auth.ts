/**
 * Authentication middleware for CaseClerk AI backend.
 * Handles JWT token validation, user authentication, and authorization.
 * Provides secure access control for protected API endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to authenticate JWT tokens
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };

    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
      return;
    }

    // Add user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: {
  id: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h'
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: {
  id: string;
  email: string;
}): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): {
  id: string;
  email: string;
} | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };

    return {
      id: decoded.id,
      email: decoded.email
    };
  } catch (error) {
    return null;
  }
};