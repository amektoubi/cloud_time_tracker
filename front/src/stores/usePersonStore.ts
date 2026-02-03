import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { personApi } from '../services/api';
import type { IPersonCreate, IPersonUpdate, IPersonResponse, IPersonStatistics } from '../types/person';

interface PersonState {
  persons: IPersonResponse[];
  selectedPerson: IPersonResponse | null;
  statistics: IPersonStatistics | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterMinAge: number | null;
}

interface PersonActions {
  fetchPersons: () => Promise<void>;
  fetchPersonById: (id: number) => Promise<void>;
  createPerson: (data: IPersonCreate) => Promise<IPersonResponse>;
  updatePerson: (id: number, data: IPersonUpdate) => Promise<IPersonResponse>;
  deletePerson: (id: number) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  searchPersons: (namePattern: string) => Promise<void>;
  getPersonsByMinimumAge: (minAge: number) => Promise<void>;
  setSelectedPerson: (person: IPersonResponse | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterMinAge: (age: number | null) => void;
  clearError: () => void;
  clearPersons: () => void;
}

export type PersonStore = PersonState & PersonActions;

const initialState: PersonState = {
  persons: [],
  selectedPerson: null,
  statistics: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  filterMinAge: null,
};

export const usePersonStore = create<PersonStore>()(
  devtools(
    (set) => ({
      ...initialState,

      fetchPersons: async () => {
        set({ isLoading: true, error: null });
        try {
          const persons = await personApi.getAllPersons();
          set({ persons, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch persons', isLoading: false });
        }
      },

      fetchPersonById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          const person = await personApi.getPersonById(id);
          set({ selectedPerson: person, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch person', isLoading: false });
        }
      },

      createPerson: async (data: IPersonCreate): Promise<IPersonResponse> => {
        set({ isLoading: true, error: null });
        try {
          const newPerson = await personApi.createPerson(data);
          set(state => ({
            persons: [...state.persons, newPerson],
            isLoading: false,
          }));
          return newPerson;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create person';
          
          // Provide user-friendly error messages
          let friendlyMessage = errorMessage;
          if (errorMessage.includes('already exists')) {
            friendlyMessage = `A person with the name "${data.name}" already exists. Please choose a different name.`;
          } else if (errorMessage.includes('Age must be at least')) {
            friendlyMessage = 'The minimum age for time tracking is 16 years old.';
          } else if (errorMessage.includes('Age must be less than or equal to')) {
            friendlyMessage = 'The maximum age for time tracking is 100 years old.';
          } else if (errorMessage.includes('Name is required')) {
            friendlyMessage = 'Please enter a name for the person.';
          } else if (errorMessage.includes('Age is required')) {
            friendlyMessage = 'Please enter an age for the person.';
          }
          
          set({ error: friendlyMessage, isLoading: false });
          throw new Error(friendlyMessage);
        }
      },

      updatePerson: async (id: number, data: IPersonUpdate): Promise<IPersonResponse> => {
        set({ isLoading: true, error: null });
        try {
          const updatedPerson = await personApi.updatePerson(id, data);
          set(state => ({
            persons: state.persons.map(person => person.id === id ? updatedPerson : person),
            selectedPerson: state.selectedPerson?.id === id ? updatedPerson : state.selectedPerson,
            isLoading: false,
          }));
          return updatedPerson;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update person';
          
          // Provide user-friendly error messages
          let friendlyMessage = errorMessage;
          if (errorMessage.includes('already exists')) {
            const name = data.name ? `the name "${data.name}"` : 'this name';
            friendlyMessage = `A person with ${name} already exists. Please choose a different name.`;
          } else if (errorMessage.includes('not found')) {
            friendlyMessage = 'The person you are trying to update was not found. They may have been deleted.';
          }
          
          set({ error: friendlyMessage, isLoading: false });
          throw new Error(friendlyMessage);
        }
      },

      deletePerson: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await personApi.deletePerson(id);
          set(state => ({
            persons: state.persons.filter(person => person.id !== id),
            selectedPerson: state.selectedPerson?.id === id ? null : state.selectedPerson,
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete person', isLoading: false });
        }
      },

      fetchStatistics: async () => {
        set({ isLoading: true, error: null });
        try {
          const statistics = await personApi.getPersonStatistics();
          set({ statistics, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch statistics', isLoading: false });
        }
      },

      searchPersons: async (namePattern: string) => {
        set({ isLoading: true, error: null });
        try {
          const persons = await personApi.searchPersonsByName(namePattern);
          set({ persons, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to search persons', isLoading: false });
        }
      },

      getPersonsByMinimumAge: async (minAge: number) => {
        set({ isLoading: true, error: null });
        try {
          const persons = await personApi.getPersonsByMinimumAge(minAge);
          set({ persons, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to filter persons by age', isLoading: false });
        }
      },

      setSelectedPerson: (person: IPersonResponse | null) => {
        set({ selectedPerson: person });
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
      },

      setFilterMinAge: (age: number | null) => {
        set({ filterMinAge: age });
      },

      clearError: () => {
        set({ error: null });
      },

      clearPersons: () => {
        set({ persons: [] });
      },
    }),
    {
      name: 'person-store',
    }
  )
);
