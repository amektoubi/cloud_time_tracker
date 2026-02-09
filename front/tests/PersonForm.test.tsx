/**
 * @fileoverview PersonForm component tests
 * @module tests/PersonForm.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonForm from '../src/components/person/PersonForm';
import { renderWithStore } from '../src/testUtils';
import type { PersonState } from '../src/stores/personSlice';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

// Helper to render component with router
const renderWithRouter = (initialRoute: string = '/persons/new') => {
  return renderWithStore(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/persons/new" element={<PersonForm />} />
        <Route path="/persons/:id/edit" element={<PersonForm />} />
      </Routes>
    </MemoryRouter>,
    createMockState()
  );
};

describe('PersonForm Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering - Create Mode', () => {
    it('renders form in create mode with correct title', () => {
      renderWithRouter('/persons/new');
      expect(screen.getByText(/Create New Person/i)).toBeInTheDocument();
    });

    it('renders form fields with correct labels', () => {
      renderWithRouter('/persons/new');
      expect(screen.getByText(/Name \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Age \*/i)).toBeInTheDocument();
    });

    it('renders submit button with correct text', () => {
      renderWithRouter('/persons/new');
      expect(screen.getByRole('button', { name: /Create Person/i })).toBeInTheDocument();
    });

    it('renders name input field', () => {
      renderWithRouter('/persons/new');
      expect(screen.getByPlaceholderText(/Enter person's name/i)).toBeInTheDocument();
    });

    it('renders age input field', () => {
      renderWithRouter('/persons/new');
      expect(screen.getByPlaceholderText(/Enter person's age/i)).toBeInTheDocument();
    });
  });

  describe('Rendering - Edit Mode', () => {
    it('renders form in edit mode with correct title', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons/123/edit']}>
          <Routes>
            <Route path="/persons/:id/edit" element={<PersonForm />} />
          </Routes>
        </MemoryRouter>,
        createMockState({ 
          selectedPerson: { 
            id: '123', 
            name: 'John Doe', 
            age: 30, 
            createdAt: '2024-01-01T00:00:00Z', 
            updatedAt: '2024-01-01T00:00:00Z' 
          } 
        })
      );

      expect(screen.getByText(/Edit Person/i)).toBeInTheDocument();
    });

    it('renders update button in edit mode', () => {
      renderWithStore(
        <MemoryRouter initialEntries={['/persons/123/edit']}>
          <Routes>
            <Route path="/persons/:id/edit" element={<PersonForm />} />
          </Routes>
        </MemoryRouter>,
        createMockState({ 
          selectedPerson: { 
            id: '123', 
            name: 'John Doe', 
            age: 30, 
            createdAt: '2024-01-01T00:00:00Z', 
            updatedAt: '2024-01-01T00:00:00Z' 
          } 
        })
      );

      expect(screen.getByRole('button', { name: /Update Person/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation error for empty name', async () => {
      const user = userEvent.setup();
      renderWithRouter('/persons/new');

      const nameInput = screen.getByPlaceholderText(/Enter person's name/i);
      await user.clear(nameInput);
      await user.click(screen.getByRole('button', { name: /Create Person/i }));

      expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    });

    it('shows validation error for empty age', async () => {
      const user = userEvent.setup();
      renderWithRouter('/persons/new');

      const nameInput = screen.getByPlaceholderText(/Enter person's name/i);
      const ageInput = screen.getByPlaceholderText(/Enter person's age/i);
      
      await user.type(nameInput, 'John Doe');
      await user.clear(ageInput);
      await user.click(screen.getByRole('button', { name: /Create Person/i }));

      expect(await screen.findByText(/Age is required/i)).toBeInTheDocument();
    });
  });
});
