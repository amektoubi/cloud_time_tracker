import axios, { AxiosError, isAxiosError } from 'axios';
import type { IPersonCreate, IPersonUpdate, IPersonResponse, IPersonStatistics } from '../types/person';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definition for API error response
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Type definition for custom API error
interface ApiError extends Error {
  status?: number;
  code?: string;
}

const handleApiError = (error: unknown): never => {
  // Handle Axios errors
  if (isAxiosError<ApiErrorResponse>(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (status === 409 && data?.error) {
      // Handle 409 Conflict with specific business error message
      const apiError: ApiError = new Error(data.error);
      apiError.status = status;
      apiError.code = 'CONFLICT';
      throw apiError;
    } else if (status === 404 && data?.error) {
      // Handle 404 Not Found with specific error message
      const apiError: ApiError = new Error(data.error);
      apiError.status = status;
      apiError.code = 'NOT_FOUND';
      throw apiError;
    } else if (status === 400 && data?.error) {
      // Handle 400 Bad Request with validation error message
      const apiError: ApiError = new Error(data.error);
      apiError.status = status;
      apiError.code = 'BAD_REQUEST';
      throw apiError;
    } else if (status && status >= 400 && status < 500) {
      // Generic client error
      const message = data?.error || data?.message || `Client error: ${status}`;
      const apiError: ApiError = new Error(message);
      apiError.status = status;
      apiError.code = 'CLIENT_ERROR';
      throw apiError;
    } else if (status && status >= 500) {
      // Server error
      const apiError: ApiError = new Error('Server error occurred. Please try again later.');
      apiError.status = status;
      apiError.code = 'SERVER_ERROR';
      throw apiError;
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    const apiError: ApiError = new Error(error.message);
    apiError.code = 'UNKNOWN_ERROR';
    throw apiError;
  }

  // Handle unknown errors
  const apiError: ApiError = new Error('An unexpected error occurred');
  apiError.code = 'UNKNOWN_ERROR';
  throw apiError;
};

export const personApi = {
  getAllPersons: (): Promise<IPersonResponse[]> =>
    api.get('/persons').then(response => response.data).catch(handleApiError),

  getPersonById: (id: string): Promise<IPersonResponse> =>
    api.get(`/persons/${id}`).then(response => response.data).catch(handleApiError),

  createPerson: (data: IPersonCreate): Promise<IPersonResponse> =>
    api.post('/persons', data).then(response => response.data).catch(handleApiError),

  updatePerson: (id: string, data: IPersonUpdate): Promise<IPersonResponse> =>
    api.put(`/persons/${id}`, data).then(response => response.data).catch(handleApiError),

  deletePerson: (id: string): Promise<void> =>
    api.delete(`/persons/${id}`).then(() => undefined).catch(handleApiError),

  getPersonStatistics: (): Promise<IPersonStatistics> =>
    api.get('/persons/stats').then(response => response.data).catch(handleApiError),

  searchPersonsByName: (namePattern: string): Promise<IPersonResponse[]> =>
    api.get(`/persons/search/${namePattern}`).then(response => response.data).catch(handleApiError),

  getPersonsByMinimumAge: (minAge: number): Promise<IPersonResponse[]> =>
    api.get(`/persons/age/${minAge}`).then(response => response.data).catch(handleApiError),
};

export default api;
