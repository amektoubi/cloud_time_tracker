/**
 * @fileoverview PersonDetails component tests
 * @module tests/PersonDetails.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonDetails from '../src/components/person/PersonDetails';
import { renderWithStore } from '../src/testUtils';
import type { PersonState } from '../src/stores/personSlice';

const createMockState = (overrides: Partial<PersonState> = {}): { person: PersonState } => ({
  person: {
    persons: [],
    selectedPerson: null,
    statistics: null,
    isLoading: true,
    error: null,
    searchTerm: '',
    filterMinAge: null,
    ...overrides,
  },
});

describe('PersonDetails Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons/123']}>
          <Routes>
            <Route path="/persons/:id" element={<PersonDetails />} />
          </Routes>
        </MemoryRouter>,
        createMockState({ isLoading: true, selectedPerson: null })
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
