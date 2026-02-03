import axios from 'axios';
import type { IPersonCreate, IPersonUpdate, IPersonResponse, IPersonStatistics } from '../types/person';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const data = error.response.data;

    if (status === 409 && data && data.error) {
      // Handle 409 Conflict with specific business error message
      throw new Error(data.error);
    } else if (status === 404 && data && data.error) {
      // Handle 404 Not Found with specific error message
      throw new Error(data.error);
    } else if (status === 400 && data && data.error) {
      // Handle 400 Bad Request with validation error message
      throw new Error(data.error);
    } else if (status >= 400 && status < 500) {
      // Generic client error
      throw new Error(data?.error || `Client error: ${status}`);
    } else if (status >= 500) {
      // Server error
      throw new Error('Server error occurred. Please try again later.');
    }
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('Network error: Unable to connect to server');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export const personApi = {
  getAllPersons: (): Promise<IPersonResponse[]> =>
    api.get('/persons').then(response => response.data).catch(handleApiError),

  getPersonById: (id: number): Promise<IPersonResponse> =>
    api.get(`/persons/${id}`).then(response => response.data).catch(handleApiError),

  createPerson: (data: IPersonCreate): Promise<IPersonResponse> =>
    api.post('/persons', data).then(response => response.data).catch(handleApiError),

  updatePerson: (id: number, data: IPersonUpdate): Promise<IPersonResponse> =>
    api.put(`/persons/${id}`, data).then(response => response.data).catch(handleApiError),

  deletePerson: (id: number): Promise<void> =>
    api.delete(`/persons/${id}`).then(() => undefined).catch(handleApiError),

  getPersonStatistics: (): Promise<IPersonStatistics> =>
    api.get('/persons/stats').then(response => response.data).catch(handleApiError),

  searchPersonsByName: (namePattern: string): Promise<IPersonResponse[]> =>
    api.get(`/persons/search/${namePattern}`).then(response => response.data).catch(handleApiError),

  getPersonsByMinimumAge: (minAge: number): Promise<IPersonResponse[]> =>
    api.get(`/persons/age/${minAge}`).then(response => response.data).catch(handleApiError),
};

export default api;
