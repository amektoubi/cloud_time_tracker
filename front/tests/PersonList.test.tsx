/**
 * @fileoverview PersonList component tests
 * @module tests/PersonList.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonList from '../src/components/person/PersonList';
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

describe('PersonList Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('renders the page title', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByRole('heading', { name: /Persons/i })).toBeInTheDocument();
    });

    it('renders add new person button', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByRole('link', { name: /Add New Person/i })).toBeInTheDocument();
    });

    it('renders search input', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByPlaceholderText(/Search by name.../i)).toBeInTheDocument();
    });

    it('renders min age filter input', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByPlaceholderText(/Age filter/i)).toBeInTheDocument();
    });

    it('renders view statistics button', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>,
        createMockState()
      );

      expect(screen.getByRole('link', { name: /View Statistics/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons']}>
          <PersonList />
        </MemoryRouter>,
        createMockState({ isLoading: true })
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Loading persons.../i)).toBeInTheDocument();
    });
  });
});
