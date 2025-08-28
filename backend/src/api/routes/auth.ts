/**
 * Authentication routes for CaseClerk AI backend.
 * Handles user login, registration, token refresh, and logout.
 * Integrates with Base44 platform for user management.
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { base44Api } from '../../services/base44';

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  license_level: string;
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Validate input
  if (!email || !password) {
    throw createError('Email and password are required', 400, 'MISSING_CREDENTIALS');
  }

  try {
    // For now, use mock authentication
    // In production, this would query your user database
    const mockUsers = [
      {
        id: '1',
        email: 'demo@caseclerk.ai',
        password: await bcrypt.hash('demo123', 10),
        full_name: 'Demo User',
        role: 'attorney',
        onboarding_completed: true
      }
    ];

    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate tokens
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email
    });

    // Return user data and tokens
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          onboarding_completed: user.onboarding_completed
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 24 * 60 * 60 // 24 hours in seconds
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    throw createError('Authentication failed', 401, 'AUTH_FAILED');
  }
}));

/**
 * POST /api/auth/register
 * Register new user account
 */
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name, license_level }: RegisterRequest = req.body;

  // Validate input
  if (!email || !password || !full_name || !license_level) {
    throw createError('All fields are required', 400, 'MISSING_FIELDS');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError('Invalid email format', 400, 'INVALID_EMAIL');
  }

  // Validate password strength
  if (password.length < 6) {
    throw createError('Password must be at least 6 characters', 400, 'WEAK_PASSWORD');
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (mock implementation)
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      full_name,
      license_level,
      role: license_level === 'attorney' ? 'attorney' : 'user',
      onboarding_completed: false,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };

    // Generate tokens
    const accessToken = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    const refreshToken = generateRefreshToken({
      id: newUser.id,
      email: newUser.email
    });

    // Return user data and tokens
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          onboarding_completed: newUser.onboarding_completed
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 24 * 60 * 60
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    throw createError('Registration failed', 500, 'REGISTRATION_FAILED');
  }
}));

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw createError('Refresh token required', 400, 'MISSING_REFRESH_TOKEN');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refresh_token);
  if (!decoded) {
    throw createError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Generate new access token
  const accessToken = generateToken({
    id: decoded.id,
    email: decoded.email,
    role: 'attorney' // This should come from user data
  });

  res.json({
    success: true,
    data: {
      access_token: accessToken,
      expires_in: 24 * 60 * 60
    }
  });
}));

/**
 * POST /api/auth/logout
 * Logout user (invalidate tokens)
 */
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // In a real implementation, you would:
  // 1. Add the token to a blacklist
  // 2. Remove refresh token from database
  // 3. Clear any session data

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  // This would typically require authentication middleware
  // For now, return mock user data
  
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'demo@caseclerk.ai',
      full_name: 'Demo User',
      role: 'attorney',
      onboarding_completed: true,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    }
  });
}));

export default router;