/**
 * @fileoverview PersonDetails component tests
 * @module tests/PersonDetails.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonDetails from '../src/components/person/PersonDetails';
import { usePersonStore } from '../src/stores/usePersonStore';

// Mock the person store
vi.mock('../src/stores/usePersonStore', () => ({
  usePersonStore: vi.fn(() => ({
    selectedPerson: null,
    isLoading: false,
    error: null,
    fetchPersonById: vi.fn(),
    deletePerson: vi.fn(),
    clearError: vi.fn(),
  })),
}));

const mockPerson = {
  id: '123',
  name: 'John Doe',
  age: 30,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

const createMockStore = (overrides = {}) => ({
  selectedPerson: mockPerson,
  isLoading: false,
  error: null,
  fetchPersonById: vi.fn(),
  deletePerson: vi.fn(),
  clearError: vi.fn(),
  ...overrides,
});

describe('PersonDetails Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    (usePersonStore as unknown as vi.Mock).mockImplementation(() => createMockStore());
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders person details card', () => {
      render(
        <MemoryRouter initialEntries={['/persons/123']}>
          <Routes>
            <Route path="/persons/:id" element={<PersonDetails />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Person Details/i)).toBeInTheDocument();
    });

    it('renders person name', () => {
      render(
        <MemoryRouter initialEntries={['/persons/123']}>
          <Routes>
            <Route path="/persons/:id" element={<PersonDetails />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    it('renders person age', () => {
      render(
        <MemoryRouter initialEntries={['/persons/123']}>
          <Routes>
            <Route path="/persons/:id" element={<PersonDetails />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/30/i)).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('fetches person data on mount', () => {
      const mockFetchPersonById = vi.fn();
      (usePersonStore as unknown as vi.Mock).mockImplementation(() =>
        createMockStore({ fetchPersonById: mockFetchPersonById })
      );

      render(
        <MemoryRouter initialEntries={['/persons/123']}>
          <Routes>
            <Route path="/persons/:id" element={<PersonDetails />} />
          </Routes>
        </MemoryRouter>
      );

      expect(mockFetchPersonById).toHaveBeenCalledWith('123');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      (usePersonStore as unknown as vi.Mock).mockImplementation(() =>
        createMockStore({ isLoading: true, selectedPerson: null })
      );

      render(
        <MemoryRouter initialEntries={['/persons/123']}>
          <Routes>
            <Route path="/persons/:id" element={<PersonDetails />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
