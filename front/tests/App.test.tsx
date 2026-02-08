/**
 * @fileoverview App component tests
 * @module tests/App.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

// Mock the person store
vi.mock('../src/stores/usePersonStore', () => ({
  usePersonStore: vi.fn(() => ({
    persons: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    filterMinAge: null,
    selectedPerson: null,
    statistics: null,
    fetchPersons: vi.fn(),
    fetchPersonById: vi.fn(),
    createPerson: vi.fn(),
    updatePerson: vi.fn(),
    deletePerson: vi.fn(),
    fetchStatistics: vi.fn(),
    searchPersons: vi.fn(),
    getPersonsByMinimumAge: vi.fn(),
    setSelectedPerson: vi.fn(),
    setSearchTerm: vi.fn(),
    setFilterMinAge: vi.fn(),
    clearError: vi.fn(),
    clearPersons: vi.fn(),
  })),
}));

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
      render(<App />);

      const appContainer = screen.getByTestId('app-container');
      expect(appContainer).toBeInTheDocument();
    });

    it('renders the navbar with correct brand', () => {
      render(<App />);

      const brandElement = screen.getByText(/Cloud Time Tracker/i);
      expect(brandElement).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<App />);

      const personsLink = screen.getByRole('link', { name: /Persons/i });
      const statisticsLink = screen.getByRole('link', { name: /Statistics/i });

      expect(personsLink).toBeInTheDocument();
      expect(statisticsLink).toHaveAttribute('href', '/statistics');
    });
  });

  describe('Navigation', () => {
    it('redirects root path to /persons', () => {
      render(<App />);

      const personsLink = screen.getByRole('link', { name: /Persons/i });
      expect(personsLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('navbar has correct ARIA attributes', () => {
      render(<App />);

      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
    });
  });
});
