/**
 * Core utility functions for CaseClerk AI frontend.
 * Provides common helper functions for routing, formatting, validation, and UI operations.
 * Used throughout the application for consistent functionality.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Page routing utilities for Next.js App Router
 */
export const routing = {
  /**
   * Create page URL for internal navigation
   * Maps page names to their corresponding routes
   */
  createPageUrl(pageName: string): string {
    const routes: Record<string, string> = {
      'Dashboard': '/dashboard',
      'Cases': '/cases',
      'CaseDetail': '/cases',
      'Onboarding': '/onboarding',
      'Upload': '/upload',
      'Calendar': '/calendar',
      'Research': '/research',
      'Calling': '/calling',
      'Settings': '/settings',
      'Profile': '/profile',
      'Documents': '/documents',
      'Reports': '/reports',
      'Help': '/help',
      'Login': '/login',
      'Register': '/register'
    };

    return routes[pageName] || '/dashboard';
  },

  /**
   * Get current page name from pathname
   */
  getCurrentPageName(pathname: string): string {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/cases': 'Cases',
      '/onboarding': 'Onboarding',
      '/upload': 'Upload',
      '/calendar': 'Calendar',
      '/research': 'Research',
      '/calling': 'Calling',
      '/settings': 'Settings',
      '/profile': 'Profile',
      '/documents': 'Documents',
      '/reports': 'Reports',
      '/help': 'Help',
      '/login': 'Login',
      '/register': 'Register'
    };

    return pathMap[pathname] || 'Dashboard';
  }
};

// Export createPageUrl for backward compatibility
export const createPageUrl = routing.createPageUrl;

/**
 * Date and time formatting utilities
 */
export const dateUtils = {
  /**
   * Format date for display
   */
  formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'relative':
        return this.getRelativeTime(dateObj);
      default:
        return dateObj.toLocaleDateString();
    }
  },

  /**
   * Format time for display
   */
  formatTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format date and time together
   */
  formatDateTime(date: string | Date): string {
    return `${this.formatDate(date)} at ${this.formatTime(date)}`;
  },

  /**
   * Get relative time (e.g., "2 hours ago", "in 3 days")
   */
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return this.formatDate(date);
  },

  /**
   * Check if date is today
   */
  isToday(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
  },

  /**
   * Check if date is overdue
   */
  isOverdue(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  }
};

/**
 * String formatting utilities
 */
export const stringUtils = {
  /**
   * Capitalize first letter of string
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert string to title case
   */
  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Truncate string with ellipsis
   */
  truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  /**
   * Generate initials from name
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  },

  /**
   * Format phone number
   */
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  /**
   * Generate slug from string
   */
  slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
};

/**
 * File and size utilities
 */
export const fileUtils = {
  /**
   * Format file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  /**
   * Check if file is an image
   */
  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return imageExtensions.includes(extension);
  },

  /**
   * Check if file is a document
   */
  isDocumentFile(filename: string): boolean {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return docExtensions.includes(extension);
  },

  /**
   * Get file type icon name
   */
  getFileTypeIcon(filename: string): string {
    const extension = this.getFileExtension(filename).toLowerCase();
    
    if (this.isImageFile(filename)) return 'image';
    if (this.isDocumentFile(filename)) return 'file-text';
    
    switch (extension) {
      case 'pdf': return 'file-text';
      case 'zip':
      case 'rar':
      case '7z': return 'archive';
      case 'mp3':
      case 'wav':
      case 'ogg': return 'music';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video';
      default: return 'file';
    }
  }
};

/**
 * Validation utilities
 */
export const validation = {
  /**
   * Validate email address
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if string is empty or whitespace
   */
  isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  },

  /**
   * Validate case number format
   */
  isValidCaseNumber(caseNumber: string): boolean {
    // Basic format: YYYY-XX-NNNNNN (year-type-number)
    const caseRegex = /^\d{4}-[A-Z]{2}-\d{6}$/;
    return caseRegex.test(caseNumber);
  }
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  /**
   * Set item in localStorage
   */
  setItem(key: string, value: any): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  },

  /**
   * Get item from localStorage
   */
  getItem<T = any>(key: string): T | null {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error('Error getting localStorage item:', error);
    }
    return null;
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Color utilities for UI elements
 */
export const colorUtils = {
  /**
   * Get status color class
   */
  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'active': 'text-green-600 bg-green-100',
      'pending': 'text-yellow-600 bg-yellow-100',
      'completed': 'text-blue-600 bg-blue-100',
      'cancelled': 'text-gray-600 bg-gray-100',
      'failed': 'text-red-600 bg-red-100',
      'urgent': 'text-red-600 bg-red-100',
      'high': 'text-orange-600 bg-orange-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-gray-600 bg-gray-100'
    };
    
    return statusColors[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
  },

  /**
   * Get priority color class
   */
  getPriorityColor(priority: string): string {
    const priorityColors: Record<string, string> = {
      'critical': 'text-red-700 bg-red-100 border-red-200',
      'urgent': 'text-red-600 bg-red-100 border-red-200',
      'high': 'text-orange-600 bg-orange-100 border-orange-200',
      'medium': 'text-yellow-600 bg-yellow-100 border-yellow-200',
      'low': 'text-gray-600 bg-gray-100 border-gray-200'
    };
    
    return priorityColors[priority.toLowerCase()] || 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}