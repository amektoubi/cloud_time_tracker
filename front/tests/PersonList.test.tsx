/**
 * @fileoverview PersonList component tests
 * @module tests/PersonList.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PersonList from '../src/components/person/PersonList';
import { usePersonStore } from '../src/stores/usePersonStore';

// Mock the person store with a factory function
vi.mock('../src/stores/usePersonStore', () => ({
  usePersonStore: vi.fn(() => ({
    persons: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    filterMinAge: null,
    fetchPersons: vi.fn(),
    searchPersons: vi.fn(),
    getPersonsByMinimumAge: vi.fn(),
    setSearchTerm: vi.fn(),
    setFilterMinAge: vi.fn(),
    deletePerson: vi.fn(),
    clearError: vi.fn(),
  })),
}));

const mockPersons = [
  { id: '1', name: 'John Doe', age: 30, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Jane Doe', age: 25, createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
];

const createMockStore = (overrides = {}) => ({
  persons: mockPersons,
  isLoading: false,
  error: null,
  searchTerm: '',
  filterMinAge: null,
  fetchPersons: vi.fn(),
  searchPersons: vi.fn(),
  getPersonsByMinimumAge: vi.fn(),
  setSearchTerm: vi.fn(),
  setFilterMinAge: vi.fn(),
  deletePerson: vi.fn(),
  clearError: vi.fn(),
  ...overrides,
});

describe('PersonList Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Reset the mock to return fresh vi.fn() implementations
    (usePersonStore as unknown as vi.Mock).mockImplementation(() => createMockStore());
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the page title', () => {
      render(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>
      );

      expect(screen.getByText(/Persons/i)).toBeInTheDocument();
    });

    it('renders add new person button', () => {
      render(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>
      );

      expect(screen.getByRole('link', { name: /Add New Person/i })).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>
      );

      expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
    });

    it('renders person table with data', () => {
      render(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>
      );

      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      (usePersonStore as unknown as vi.Mock).mockImplementation(() => createMockStore({ isLoading: true }));

      render(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error is present', () => {
      (usePersonStore as unknown as vi.Mock).mockImplementation(() =>
        createMockStore({ error: 'Failed to fetch persons' })
      );

      render(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>
      );

      expect(screen.getByText(/Failed to fetch persons/i)).toBeInTheDocument();
    });
  });
});
