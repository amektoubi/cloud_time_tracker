import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { personApi } from '../services/api';
import type { IPersonCreate, IPersonUpdate, IPersonResponse, IPersonStatistics } from '../types/person';

export interface PersonState {
  persons: IPersonResponse[];
  selectedPerson: IPersonResponse | null;
  statistics: IPersonStatistics | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterMinAge: number | null;
}

const initialState: PersonState = {
  persons: [],
  selectedPerson: null,
  statistics: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  filterMinAge: null,
};

export const fetchPersons = createAsyncThunk(
  'person/fetchPersons',
  async (_, { rejectWithValue }) => {
    try {
      const persons = await personApi.getAllPersons();
      return persons;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch persons');
    }
  }
);

export const fetchPersonById = createAsyncThunk(
  'person/fetchPersonById',
  async (id: string, { rejectWithValue }) => {
    try {
      const person = await personApi.getPersonById(id);
      return person;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch person');
    }
  }
);

export const createPerson = createAsyncThunk(
  'person/createPerson',
  async (data: IPersonCreate, { rejectWithValue }) => {
    try {
      const newPerson = await personApi.createPerson(data);
      return newPerson;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create person';
      
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
      
      return rejectWithValue(friendlyMessage);
    }
  }
);

export const updatePerson = createAsyncThunk(
  'person/updatePerson',
  async ({ id, data }: { id: string; data: IPersonUpdate }, { rejectWithValue }) => {
    try {
      const updatedPerson = await personApi.updatePerson(id, data);
      return updatedPerson;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update person';
      
      let friendlyMessage = errorMessage;
      if (errorMessage.includes('already exists')) {
        const name = data.name ? `the name "${data.name}"` : 'this name';
        friendlyMessage = `A person with ${name} already exists. Please choose a different name.`;
      } else if (errorMessage.includes('not found')) {
        friendlyMessage = 'The person you are trying to update was not found. They may have been deleted.';
      }
      
      return rejectWithValue(friendlyMessage);
    }
  }
);

export const deletePerson = createAsyncThunk(
  'person/deletePerson',
  async (id: string, { rejectWithValue }) => {
    try {
      await personApi.deletePerson(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete person');
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'person/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const statistics = await personApi.getPersonStatistics();
      return statistics;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch statistics');
    }
  }
);

export const searchPersons = createAsyncThunk(
  'person/searchPersons',
  async (namePattern: string, { rejectWithValue }) => {
    try {
      const persons = await personApi.searchPersonsByName(namePattern);
      return persons;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search persons');
    }
  }
);

export const getPersonsByMinimumAge = createAsyncThunk(
  'person/getPersonsByMinimumAge',
  async (minAge: number, { rejectWithValue }) => {
    try {
      const persons = await personApi.getPersonsByMinimumAge(minAge);
      return persons;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to filter persons by age');
    }
  }
);

const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    setSelectedPerson: (state, action: PayloadAction<IPersonResponse | null>) => {
      state.selectedPerson = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterMinAge: (state, action: PayloadAction<number | null>) => {
      state.filterMinAge = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPersons: (state) => {
      state.persons = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        state.persons = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPersonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPersonById.fulfilled, (state, action) => {
        state.selectedPerson = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPersonById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPerson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPerson.fulfilled, (state, action) => {
        state.persons.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createPerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePerson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        const index = state.persons.findIndex(person => person.id === action.payload.id);
        if (index !== -1) {
          state.persons[index] = action.payload;
        }
        if (state.selectedPerson?.id === action.payload.id) {
          state.selectedPerson = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePerson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.persons = state.persons.filter(person => person.id !== action.payload);
        if (state.selectedPerson?.id === action.payload) {
          state.selectedPerson = null;
        }
        state.isLoading = false;
      })
      .addCase(deletePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchPersons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPersons.fulfilled, (state, action) => {
        state.persons = action.payload;
        state.isLoading = false;
      })
      .addCase(searchPersons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getPersonsByMinimumAge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPersonsByMinimumAge.fulfilled, (state, action) => {
        state.persons = action.payload;
        state.isLoading = false;
      })
      .addCase(getPersonsByMinimumAge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedPerson,
  setSearchTerm,
  setFilterMinAge,
  clearError,
  clearPersons,
} = personSlice.actions;

export const personReducer = personSlice.reducer;
