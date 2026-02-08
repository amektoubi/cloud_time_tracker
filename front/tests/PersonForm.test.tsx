/**
 * @fileoverview PersonForm component tests
 * @module tests/PersonForm.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonForm from '../src/components/person/PersonForm';
import { usePersonStore } from '../src/stores/usePersonStore';

// Mock the person store
vi.mock('../src/stores/usePersonStore', () => ({
  usePersonStore: vi.fn(() => ({
    selectedPerson: null,
    isLoading: false,
    error: null,
    fetchPersonById: vi.fn(),
    createPerson: vi.fn(),
    updatePerson: vi.fn(),
    clearError: vi.fn(),
  })),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockFetchPersonById = vi.fn();
const mockCreatePerson = vi.fn();
const mockUpdatePerson = vi.fn();
const mockClearError = vi.fn();

// Helper to render component with router
const renderWithRouter = (initialRoute: string = '/persons/new') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/persons/new" element={<PersonForm />} />
        <Route path="/persons/:id/edit" element={<PersonForm />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PersonForm Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockNavigate.mockClear();
    (usePersonStore as unknown as vi.Mock).mockImplementation(() => ({
      selectedPerson: null,
      isLoading: false,
      error: null,
      fetchPersonById: mockFetchPersonById,
      createPerson: mockCreatePerson,
      updatePerson: mockUpdatePerson,
      clearError: mockClearError,
    }));
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
      // Use getByText since Form.Label with icons doesn't work well with getByLabelText
      expect(screen.getByText(/Name \*/i)).toBeInTheDocument();
      expect(screen.getByText(/Age \*/i)).toBeInTheDocument();
    });

    it('renders submit button with correct text', () => {
      renderWithRouter('/persons/new');
      expect(screen.getByRole('button', { name: /Create Person/i })).toBeInTheDocument();
    });
  });

  describe('Rendering - Edit Mode', () => {
    const mockPerson = {
      id: '123',
      name: 'John Doe',
      age: 30,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      (usePersonStore as unknown as vi.Mock).mockImplementation(() => ({
        selectedPerson: mockPerson,
        isLoading: false,
        error: null,
        fetchPersonById: mockFetchPersonById,
        createPerson: mockCreatePerson,
        updatePerson: mockUpdatePerson,
        clearError: mockClearError,
      }));
    });

    it('renders form in edit mode with correct title', () => {
      render(
        <MemoryRouter initialEntries={['/persons/123/edit']}>
          <Routes>
            <Route path="/persons/:id/edit" element={<PersonForm />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Edit Person/i)).toBeInTheDocument();
    });

    it('fetches person data when in edit mode', () => {
      render(
        <MemoryRouter initialEntries={['/persons/123/edit']}>
          <Routes>
            <Route path="/persons/:id/edit" element={<PersonForm />} />
          </Routes>
        </MemoryRouter>
      );

      expect(mockFetchPersonById).toHaveBeenCalledWith('123');
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

  describe('Error Handling', () => {
    it('displays error message from store', () => {
      (usePersonStore as unknown as vi.Mock).mockImplementation(() => ({
        selectedPerson: null,
        isLoading: false,
        error: 'Test error message',
        fetchPersonById: mockFetchPersonById,
        createPerson: mockCreatePerson,
        updatePerson: mockUpdatePerson,
        clearError: mockClearError,
      }));

      renderWithRouter('/persons/new');
      expect(screen.getByText(/Test error message/i)).toBeInTheDocument();
    });
  });
});
