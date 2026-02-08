/**
 * @fileoverview Date formatting utilities
 * @module utils/date
 */

/**
 * Format a date string to a localized date string
 * @param dateString - ISO 8601 date string
 * @param locales - Locale string(s) (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions (default: { year: 'numeric', month: 'short', day: 'numeric' })
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locales: string | string[] = 'en-US',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locales, options);
};

/**
 * Format a date string to a localized datetime string
 * @param dateString - ISO 8601 date string
 * @param locales - Locale string(s) (default: 'en-US')
 * @returns Formatted datetime string
 */
export const formatDateTime = (
  dateString: string,
  locales: string | string[] = 'en-US'
): string => {
  const date = new Date(dateString);
  return date.toLocaleString(locales, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a date string to a relative time string (e.g., "2 days ago")
 * @param dateString - ISO 8601 date string
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
  }

  return formatDate(dateString);
};

/**
 * Check if a date is today
 * @param dateString - ISO 8601 date string
 * @returns True if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 * @param dateString - ISO 8601 date string
 * @returns True if the date is yesterday
 */
export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Format a date with today/yesterday labels
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string with relative label
 */
export const formatDateWithLabel = (dateString: string): string => {
  if (isToday(dateString)) {
    return `Today at ${new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  if (isYesterday(dateString)) {
    return `Yesterday at ${new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  return formatDateTime(dateString);
};

export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isToday,
  isYesterday,
  formatDateWithLabel,
};
