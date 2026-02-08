/**
 * @fileoverview Mock data for Persons API
 * @module mocks/data
 */

import { v4 as uuidv4 } from 'uuid';

// Type definitions based on OpenAPI spec
export interface PersonDTO {
  name: string;
  age: number;
}

export interface PersonResponse {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonStatistics {
  totalCount: number;
  averageAge: number;
  minAge: number;
  maxAge: number;
}

// Generate timestamps
const now = new Date();
const formatDate = (date: Date): string => date.toISOString();

// Mock persons database
const personsDb: PersonResponse[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'John Doe',
    age: 30,
    createdAt: formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
    updatedAt: formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
  },
  {
    id: 'b5f3c922-11b2-4d22-8c11-92f750d56567',
    name: 'Jane Smith',
    age: 25,
    createdAt: formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
  },
  {
    id: '6cc4f5c3-eaf3-4aea-9b82-e31fa8913eb0',
    name: 'Bob Johnson',
    age: 50,
    createdAt: formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
  },
];

// Helper functions
export const getAllPersons = (): PersonResponse[] => {
  return [...personsDb];
};

export const getPersonById = (id: string): PersonResponse | undefined => {
  return personsDb.find(p => p.id === id);
};

export const createPerson = (data: PersonDTO): PersonResponse => {
  const newPerson: PersonResponse = {
    id: uuidv4(),
    name: data.name,
    age: data.age,
    createdAt: formatDate(new Date()),
    updatedAt: formatDate(new Date()),
  };
  personsDb.push(newPerson);
  return newPerson;
};

export const updatePerson = (id: string, data: PersonDTO): PersonResponse | undefined => {
  const index = personsDb.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  
  personsDb[index] = {
    ...personsDb[index],
    name: data.name,
    age: data.age,
    updatedAt: formatDate(new Date()),
  };
  return personsDb[index];
};

export const deletePerson = (id: string): boolean => {
  const index = personsDb.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  personsDb.splice(index, 1);
  return true;
};

export const getPersonStatistics = (): PersonStatistics => {
  if (personsDb.length === 0) {
    return {
      totalCount: 0,
      averageAge: 0,
      minAge: 0,
      maxAge: 0,
    };
  }
  
  const ages = personsDb.map(p => p.age);
  const totalCount = personsDb.length;
  const averageAge = ages.reduce((sum, age) => sum + age, 0) / totalCount;
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  
  return {
    totalCount,
    averageAge,
    minAge,
    maxAge,
  };
};

export const searchPersonsByName = (namePattern: string): PersonResponse[] => {
  const pattern = namePattern.toLowerCase();
  return personsDb.filter(p => p.name.toLowerCase().includes(pattern));
};

export const getPersonsByMinimumAge = (minAge: number): PersonResponse[] => {
  return personsDb.filter(p => p.age >= minAge);
};

// Reset database for tests
export const resetDb = (): void => {
  personsDb.length = 0;
  personsDb.push(
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'John Doe',
      age: 30,
      createdAt: formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
      updatedAt: formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
    },
    {
      id: 'b5f3c922-11b2-4d22-8c11-92f750d56567',
      name: 'Jane Smith',
      age: 25,
      createdAt: formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
      updatedAt: formatDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
    },
    {
      id: '6cc4f5c3-eaf3-4aea-9b82-e31fa8913eb0',
      name: 'Bob Johnson',
      age: 50,
      createdAt: formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
      updatedAt: formatDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
    }
  );
};
