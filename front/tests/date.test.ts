/**
 * @fileoverview Date utility tests
 * @module tests/date.spec
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isToday,
  isYesterday,
  formatDateWithLabel,
} from '../src/utils/date';

describe('Date Utilities', () => {
  const testDate = '2024-01-15T10:30:00Z';

  describe('formatDate', () => {
    it('formats date with default options', () => {
      const result = formatDate(testDate);
      expect(result).toBe('Jan 15, 2024');
    });

    it('formats date with custom locale', () => {
      const result = formatDate(testDate, 'fr-FR');
      expect(result).toContain('2024');
    });

    it('formats date with custom options', () => {
      const result = formatDate(testDate, 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(result).toBe('January 15, 2024');
    });

    it('formats date with short options', () => {
      const result = formatDate(testDate, 'en-US', {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
      });
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{2}$/);
    });
  });

  describe('formatDateTime', () => {
    it('formats datetime with default options', () => {
      const result = formatDateTime(testDate);
      expect(result).toContain('2024');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });

    it('formats datetime with custom locale', () => {
      const result = formatDateTime(testDate, 'de-DE');
      expect(result).toContain('2024');
    });

    it('includes time in the formatted string', () => {
      const result = formatDateTime(testDate);
      // Should contain time separator (like : or a space followed by AM/PM)
      expect(result).toMatch(/(\d{1,2}:\d{2}|AM|PM)/);
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "just now" for recent dates', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 30000).toISOString(); // 30 seconds ago
      const result = formatRelativeTime(recentDate);
      expect(result).toBe('just now');
    });

    it('returns minutes ago for dates within an hour', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toBe('5 minutes ago');
    });

    it('returns 1 minute ago for exactly one minute', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000).toISOString();
      const result = formatRelativeTime(oneMinuteAgo);
      expect(result).toBe('1 minute ago');
    });

    it('returns hours ago for dates within a day', () => {
      const now = new Date();
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeTime(threeHoursAgo);
      expect(result).toBe('3 hours ago');
    });

    it('returns days ago for dates within a week', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeTime(twoDaysAgo);
      expect(result).toBe('2 days ago');
    });

    it('returns weeks ago for dates within a month', () => {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeTime(twoWeeksAgo);
      expect(result).toBe('2 weeks ago');
    });

    it('falls back to formatDate for old dates', () => {
      const oldDate = '2020-01-01T10:00:00Z';
      const result = formatRelativeTime(oldDate);
      expect(result).toContain('2020');
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date().toISOString();
      expect(isToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday.toISOString())).toBe(true);
    });

    it('returns false for dates more than 24 hours ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      expect(isToday(twoDaysAgo.toISOString())).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('returns true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday.toISOString())).toBe(true);
    });

    it('returns false for today', () => {
      const today = new Date().toISOString();
      expect(isYesterday(today)).toBe(false);
    });

    it('returns false for two days ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      expect(isYesterday(twoDaysAgo.toISOString())).toBe(false);
    });
  });

  describe('formatDateWithLabel', () => {
    it('returns "Today at" for today dates', () => {
      const today = new Date().toISOString();
      const result = formatDateWithLabel(today);
      expect(result).toContain('Today at');
    });

    it('returns "Yesterday at" for yesterday dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatDateWithLabel(yesterday.toISOString());
      expect(result).toContain('Yesterday at');
    });

    it('returns formatted datetime for older dates', () => {
      const result = formatDateWithLabel(testDate);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid date strings gracefully', () => {
      const invalidDate = 'not-a-date';
      // Should not throw, but may return Invalid Date
      expect(() => formatDate(invalidDate)).not.toThrow();
    });

    it('handles empty string', () => {
      expect(() => formatDate('')).not.toThrow();
    });

    it('handles timezone variations', () => {
      const result = formatDate(testDate, 'en-US');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Locale Variations', () => {
    it('formats correctly for US English', () => {
      const result = formatDate(testDate, 'en-US');
      expect(result).toMatch(/Jan \d{1,2}, 2024/);
    });

    it('formats correctly for British English', () => {
      const result = formatDate(testDate, 'en-GB');
      expect(result).toContain('2024');
    });

    it('formats correctly for German', () => {
      const result = formatDate(testDate, 'de-DE');
      expect(result).toContain('2024');
    });

    it('formats correctly for French', () => {
      const result = formatDate(testDate, 'fr-FR');
      expect(result).toContain('2024');
    });
  });
});
