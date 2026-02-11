/**
 * @fileoverview App component tests
 * @module tests/App.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import App from '../src/App';
import { renderWithStore } from '../src/testUtils';
import type { PersonState } from '../src/stores/personSlice';

const createMockState = (overrides: Partial<PersonState> = {}): { person: PersonState } => ({
  person: {
    persons: [],
    selectedPerson: null,
    statistics: null,
    isLoading: false,
    error: null,
    searchTerm: '',
    filterMinAge: null,
    ...overrides,
  },
});

describe('App Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the app without crashing', () => {
      renderWithStore(<App />, createMockState());

      const appContainer = screen.getByTestId('app-container');
      expect(appContainer).toBeInTheDocument();
    });

    it('renders the navbar with correct brand', () => {
      renderWithStore(<App />, createMockState());

      const brandElement = screen.getByText(/Cloud Time Tracker/i);
      expect(brandElement).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      renderWithStore(<App />, createMockState());

      const personsLink = screen.getByRole('link', { name: /Persons/i });
      const statisticsLink = screen.getByRole('link', { name: /Statistics/i });

      expect(personsLink).toBeInTheDocument();
      expect(statisticsLink).toHaveAttribute('href', '/statistics');
    });
  });

  describe('Navigation', () => {
    it('has persons link with correct href', () => {
      renderWithStore(<App />, createMockState());

      const personsLink = screen.getByRole('link', { name: /Persons/i });
      expect(personsLink).toHaveAttribute('href', '/persons');
    });
  });

  describe('Accessibility', () => {
    it('navbar has correct ARIA attributes', () => {
      renderWithStore(<App />, createMockState());

      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
    });
  });
});
