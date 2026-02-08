/**
 * @fileoverview MSW mock server setup for testing
 * @module mocks/server
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the mock server
export const mockServer = setupServer(...handlers);

// Helper to reset handlers before each test
export const resetMockServer = (): void => {
  mockServer.resetHandlers();
};

// Helper to close the server after all tests
export const closeMockServer = async (): Promise<void> => {
  await mockServer.close();
};

// Export server instance for advanced use
export default mockServer;
