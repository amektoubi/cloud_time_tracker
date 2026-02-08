/**
 * @fileoverview PersonStatistics component tests
 * @module tests/PersonStatistics.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PersonStatistics from '../src/components/person/PersonStatistics';
import { usePersonStore } from '../src/stores/usePersonStore';

// Mock the person store
vi.mock('../src/stores/usePersonStore', () => ({
  usePersonStore: vi.fn(() => ({
    statistics: null,
    isLoading: false,
    error: null,
    fetchStatistics: vi.fn(),
    clearError: vi.fn(),
  })),
}));

const mockStatistics = {
  totalCount: 100,
  averageAge: 35.5,
  minAge: 18,
  maxAge: 75,
};

const createMockStore = (overrides = {}) => ({
  statistics: mockStatistics,
  isLoading: false,
  error: null,
  fetchStatistics: vi.fn(),
  clearError: vi.fn(),
  ...overrides,
});

describe('PersonStatistics Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    (usePersonStore as unknown as vi.Mock).mockImplementation(() => createMockStore());
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders statistics page title', () => {
      render(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>
      );

      expect(screen.getByText(/Person Statistics/i)).toBeInTheDocument();
    });

    it('renders total count card', () => {
      render(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>
      );

      expect(screen.getByText(/Total Persons/i)).toBeInTheDocument();
      expect(screen.getByText(/100/i)).toBeInTheDocument();
    });

    it('renders average age card', () => {
      render(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>
      );

      expect(screen.getByText(/Average Age/i)).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('fetches statistics on mount', () => {
      const mockFetchStatistics = vi.fn();
      (usePersonStore as unknown as vi.Mock).mockImplementation(() =>
        createMockStore({ fetchStatistics: mockFetchStatistics })
      );

      render(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>
      );

      expect(mockFetchStatistics).toHaveBeenCalled();
    });
  });

  describe('Quick Actions', () => {
    it('renders add new person button', () => {
      render(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>
      );

      expect(screen.getByRole('link', { name: /Add New Person/i })).toBeInTheDocument();
    });
  });
});
