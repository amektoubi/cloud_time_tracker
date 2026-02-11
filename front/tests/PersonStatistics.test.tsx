/**
 * @fileoverview PersonStatistics component tests
 * @module tests/PersonStatistics.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonStatistics from '../src/components/person/PersonStatistics';
import { renderWithStore } from '../src/testUtils';
import type { PersonState } from '../src/stores/personSlice';

const mockStatistics = {
  totalCount: 100,
  averageAge: 35.5,
  minAge: 18,
  maxAge: 75,
};

const createMockState = (overrides: Partial<PersonState> = {}): { person: PersonState } => ({
  person: {
    persons: [],
    selectedPerson: null,
    statistics: mockStatistics,
    isLoading: false,
    error: null,
    searchTerm: '',
    filterMinAge: null,
    ...overrides,
  },
});

describe('PersonStatistics Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders statistics page title', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByText(/Person Statistics/i)).toBeInTheDocument();
    });

    it('renders add new person button', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByRole('link', { name: /Add New Person/i })).toBeInTheDocument();
    });

    it('renders back to list button', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByRole('button', { name: /Back to List/i })).toBeInTheDocument();
    });

    it('renders refresh statistics button', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByRole('button', { name: /Refresh Statistics/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/statistics']}>
          <PersonStatistics />
        </MemoryRouter>,
        createMockState({ isLoading: true })
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
