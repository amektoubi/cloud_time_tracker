/**
 * @fileoverview ErrorBoundary component tests
 * @module tests/ErrorBoundary.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

// Test component that throws an error
const ThrowErrorComponent: React.FC = () => {
  throw new Error('Test error');
};

// Test component that renders normally
const WorkingComponent: React.FC = () => {
  return <div data-testid="working-component">Working Component</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <WorkingComponent />
        </ErrorBoundary>
      );

      const workingComponent = screen.getByTestId('working-component');
      expect(workingComponent).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('catches errors from child components', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    it('renders reload button', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole('button', { name: /Reload Page/i });
      expect(reloadButton).toBeInTheDocument();
    });

    it('renders go to home button', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      const homeButton = screen.getByRole('button', { name: /Go to Home/i });
      expect(homeButton).toBeInTheDocument();
    });
  });

  describe('Custom Fallback', () => {
    it('renders custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });
  });
});
