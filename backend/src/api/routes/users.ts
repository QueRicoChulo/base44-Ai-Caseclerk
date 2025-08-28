/**
 * Users API routes for CaseClerk AI backend.
 * Handles user profile management, settings, and onboarding.
 * Provides endpoints for user CRUD operations and preferences.
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  bar_number?: string;
  license_level: 'student' | 'pro_per' | 'paralegal' | 'attorney' | 'firm_admin';
  firm_name?: string;
  firm_address?: string;
  phone_primary: string;
  phone_secondary?: string;
  website?: string;
  default_jurisdiction?: string;
  default_court?: string;
  storage_location: 'local' | 'vps' | 'cloud';
  api_keys: {
    openai?: string;
    anthropic?: string;
    vonage?: string;
    elevenlabs?: string;
  };
  feature_flags: {
    ai_calling: boolean;
    legal_research: boolean;
    advanced_analytics: boolean;
  };
  onboarding_completed: boolean;
  created_date: string;
  updated_date: string;
}

// Mock user data
const mockUsers: UserProfile[] = [
  {
    id: '1',
    full_name: 'Demo User',
    email: 'demo@caseclerk.ai',
    bar_number: '123456',
    license_level: 'attorney',
    firm_name: 'Demo Law Firm',
    firm_address: '123 Legal St, Law City, LC 12345',
    phone_primary: '(555) 123-4567',
    phone_secondary: '(555) 123-4568',
    website: 'https://demolawfirm.com',
    default_jurisdiction: 'Superior Court of California',
    default_court: 'Los Angeles County',
    storage_location: 'vps',
    api_keys: {
      openai: 'sk-demo-key',
      anthropic: '',
      vonage: '',
      elevenlabs: ''
    },
    feature_flags: {
      ai_calling: true,
      legal_research: true,
      advanced_analytics: false
    },
    onboarding_completed: true,
    created_date: '2024-01-01T00:00:00Z',
    updated_date: '2024-01-15T10:00:00Z'
  }
];

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Remove sensitive data
  const { api_keys, ...userProfile } = user;
  const sanitizedApiKeys = {
    openai: api_keys.openai ? '***' + api_keys.openai.slice(-4) : '',
    anthropic: api_keys.anthropic ? '***' + api_keys.anthropic.slice(-4) : '',
    vonage: api_keys.vonage ? '***' + api_keys.vonage.slice(-4) : '',
    elevenlabs: api_keys.elevenlabs ? '***' + api_keys.elevenlabs.slice(-4) : ''
  };

  res.json({
    success: true,
    data: {
      ...userProfile,
      api_keys: sanitizedApiKeys
    }
  });
}));

/**
 * PUT /api/users/me
 * Update current user profile
 */
router.put('/me', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  const updates = req.body;

  // Validate email if being updated
  if (updates.email && updates.email !== mockUsers[userIndex].email) {
    const emailExists = mockUsers.some(u => u.email === updates.email && u.id !== userId);
    if (emailExists) {
      throw createError('Email already in use', 409, 'EMAIL_EXISTS');
    }
  }

  // Update user profile
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updated_date: new Date().toISOString()
  };

  // Remove sensitive data from response
  const { api_keys, ...userProfile } = mockUsers[userIndex];
  const sanitizedApiKeys = {
    openai: api_keys.openai ? '***' + api_keys.openai.slice(-4) : '',
    anthropic: api_keys.anthropic ? '***' + api_keys.anthropic.slice(-4) : '',
    vonage: api_keys.vonage ? '***' + api_keys.vonage.slice(-4) : '',
    elevenlabs: api_keys.elevenlabs ? '***' + api_keys.elevenlabs.slice(-4) : ''
  };

  res.json({
    success: true,
    data: {
      ...userProfile,
      api_keys: sanitizedApiKeys
    },
    message: 'Profile updated successfully'
  });
}));

/**
 * PUT /api/users/me/password
 * Change user password
 */
router.put('/me/password', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { current_password, new_password } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  if (!current_password || !new_password) {
    throw createError('Current and new passwords are required', 400, 'MISSING_PASSWORDS');
  }

  if (new_password.length < 6) {
    throw createError('New password must be at least 6 characters', 400, 'WEAK_PASSWORD');
  }

  // In a real implementation, you would:
  // 1. Verify current password against stored hash
  // 2. Hash new password
  // 3. Update password in database

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

/**
 * PUT /api/users/me/api-keys
 * Update user API keys
 */
router.put('/me/api-keys', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { api_keys } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Update API keys
  mockUsers[userIndex].api_keys = {
    ...mockUsers[userIndex].api_keys,
    ...api_keys
  };
  mockUsers[userIndex].updated_date = new Date().toISOString();

  res.json({
    success: true,
    message: 'API keys updated successfully'
  });
}));

/**
 * PUT /api/users/me/feature-flags
 * Update user feature flags
 */
router.put('/me/feature-flags', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { feature_flags } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Update feature flags
  mockUsers[userIndex].feature_flags = {
    ...mockUsers[userIndex].feature_flags,
    ...feature_flags
  };
  mockUsers[userIndex].updated_date = new Date().toISOString();

  res.json({
    success: true,
    data: mockUsers[userIndex].feature_flags,
    message: 'Feature flags updated successfully'
  });
}));

/**
 * POST /api/users/me/complete-onboarding
 * Mark onboarding as completed
 */
router.post('/me/complete-onboarding', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Mark onboarding as completed
  mockUsers[userIndex].onboarding_completed = true;
  mockUsers[userIndex].updated_date = new Date().toISOString();

  res.json({
    success: true,
    message: 'Onboarding completed successfully'
  });
}));

/**
 * GET /api/users/me/preferences
 * Get user preferences and settings
 */
router.get('/me/preferences', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  const preferences = {
    default_jurisdiction: user.default_jurisdiction,
    default_court: user.default_court,
    storage_location: user.storage_location,
    feature_flags: user.feature_flags,
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      reminder_time: 30 // minutes before event
    },
    ui_preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/Los_Angeles',
      date_format: 'MM/dd/yyyy',
      time_format: '12h'
    }
  };

  res.json({
    success: true,
    data: preferences
  });
}));

/**
 * PUT /api/users/me/preferences
 * Update user preferences
 */
router.put('/me/preferences', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const preferences = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Update relevant user fields
  if (preferences.default_jurisdiction) {
    mockUsers[userIndex].default_jurisdiction = preferences.default_jurisdiction;
  }
  if (preferences.default_court) {
    mockUsers[userIndex].default_court = preferences.default_court;
  }
  if (preferences.storage_location) {
    mockUsers[userIndex].storage_location = preferences.storage_location;
  }
  if (preferences.feature_flags) {
    mockUsers[userIndex].feature_flags = {
      ...mockUsers[userIndex].feature_flags,
      ...preferences.feature_flags
    };
  }

  mockUsers[userIndex].updated_date = new Date().toISOString();

  res.json({
    success: true,
    message: 'Preferences updated successfully'
  });
}));

/**
 * DELETE /api/users/me
 * Delete user account
 */
router.delete('/me', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { password } = req.body;

  if (!userId) {
    throw createError('User not authenticated', 401, 'NOT_AUTHENTICATED');
  }

  if (!password) {
    throw createError('Password required for account deletion', 400, 'PASSWORD_REQUIRED');
  }

  // In a real implementation, you would:
  // 1. Verify password
  // 2. Delete all user data (cases, documents, etc.)
  // 3. Remove user account
  // 4. Invalidate all tokens

  res.json({
    success: true,
    message: 'Account deletion initiated. You will receive a confirmation email.'
  });
}));

export default router;