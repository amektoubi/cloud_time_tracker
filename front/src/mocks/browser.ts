/**
 * @fileoverview MSW browser setup for development
 * @module mocks/browser
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the worker for browser
export const worker = setupWorker(...handlers);

// Helper to start the worker
export const startMockWorker = async (): Promise<void> => {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
};

// Export worker instance
export default worker;
