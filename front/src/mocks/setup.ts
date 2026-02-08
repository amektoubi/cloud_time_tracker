/**
 * @fileoverview MSW setup file for Vitest
 * @module mocks/setup
 */

import { beforeAll, afterEach, vi } from 'vitest';
import { mockServer } from './server';
import { resetDb } from './data';
import '@testing-library/jest-dom';

// Start the mock server before all tests
beforeAll(() => {
  mockServer.listen({ onUnhandledRequest: 'bypass' });
  resetDb();
});

// Reset handlers and database after each test
afterEach(() => {
  resetDb();
  vi.clearAllMocks();
});

// Mock window.location for tests
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    pathname: '/',
    search: '',
    hash: '',
    protocol: 'http:',
    host: 'localhost',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Mock window.confirm
window.confirm = vi.fn(() => true);

// Mock console.error to reduce noise in tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router') ||
      args[0].includes('[MSW]'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
