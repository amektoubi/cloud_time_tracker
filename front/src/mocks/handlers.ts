/**
 * @fileoverview MSW handlers for Persons API
 * @module mocks/handlers
 */

import { http, HttpResponse } from 'msw';
import {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonStatistics,
  searchPersonsByName,
  getPersonsByMinimumAge,
  type PersonDTO,
} from './data';

export const handlers = [
  // GET /persons - Get all persons
  http.get('/persons', () => {
    const persons = getAllPersons();
    return HttpResponse.json(persons);
  }),

  // POST /persons - Create a new person
  http.post('/persons', async ({ request }) => {
    try {
      const body = await request.json() as PersonDTO;
      
      // Validate required fields
      if (!body.name || typeof body.name !== 'string') {
        return HttpResponse.json(
          { error: 'Name is required' },
          { status: 400 }
        );
      }

      if (body.name.length < 2) {
        return HttpResponse.json(
          { error: 'Name must be at least 2 characters' },
          { status: 400 }
        );
      }

      if (typeof body.age !== 'number' || body.age < 0) {
        return HttpResponse.json(
          { error: 'Age is required and must be non-negative' },
          { status: 400 }
        );
      }

      if (body.age > 150) {
        return HttpResponse.json(
          { error: 'Age must be less than or equal to 150' },
          { status: 400 }
        );
      }

      const newPerson = createPerson(body);
      return HttpResponse.json(newPerson);
    } catch {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  }),

  // GET /persons/:id - Get person by ID
  http.get('/persons/:id', ({ params }) => {
    const { id } = params;
    
    // Validate UUID format
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    if (!uuidRegex.test(id as string)) {
      return HttpResponse.json(
        { error: 'Invalid UUID format' },
        { status: 400 }
      );
    }

    const person = getPersonById(id as string);
    if (!person) {
      return HttpResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(person);
  }),

  // PUT /persons/:id - Update person
  http.put('/persons/:id', async ({ params, request }) => {
    const { id } = params;
    
    try {
      const body = await request.json() as Partial<PersonDTO>;
      
      // Validate UUID format
      const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
      if (!uuidRegex.test(id as string)) {
        return HttpResponse.json(
          { error: 'Invalid UUID format' },
          { status: 400 }
        );
      }

      // Check if person exists
      const existingPerson = getPersonById(id as string);
      if (!existingPerson) {
        return HttpResponse.json(
          { error: 'Person not found' },
          { status: 404 }
        );
      }

      // Validate fields if provided
      if (body.name !== undefined) {
        if (typeof body.name !== 'string') {
          return HttpResponse.json(
            { error: 'Name must be a string' },
            { status: 400 }
          );
        }
        if (body.name.length < 2) {
          return HttpResponse.json(
            { error: 'Name must be at least 2 characters' },
            { status: 400 }
          );
        }
      }

      if (body.age !== undefined) {
        if (typeof body.age !== 'number' || body.age < 0) {
          return HttpResponse.json(
            { error: 'Age must be a non-negative number' },
            { status: 400 }
          );
        }
        if (body.age > 150) {
          return HttpResponse.json(
            { error: 'Age must be less than or equal to 150' },
            { status: 400 }
          );
        }
      }

      const updatedPerson = updatePerson(id as string, body as PersonDTO);
      return HttpResponse.json(updatedPerson);
    } catch {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  }),

  // DELETE /persons/:id - Delete person
  http.delete('/persons/:id', ({ params }) => {
    const { id } = params;
    
    // Validate UUID format
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    if (!uuidRegex.test(id as string)) {
      return HttpResponse.json(
        { error: 'Invalid UUID format' },
        { status: 400 }
      );
    }

    const deleted = deletePerson(id as string);
    if (!deleted) {
      return HttpResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ success: true });
  }),

  // GET /persons/stats - Get person statistics
  http.get('/persons/stats', () => {
    const statistics = getPersonStatistics();
    return HttpResponse.json(statistics);
  }),

  // GET /persons/search/:namePattern - Search persons by name
  http.get('/persons/search/:namePattern', ({ params }) => {
    const { namePattern } = params;
    
    if (!namePattern || typeof namePattern !== 'string') {
      return HttpResponse.json([]);
    }

    const persons = searchPersonsByName(namePattern);
    return HttpResponse.json(persons);
  }),

  // GET /persons/age/:minAge - Get persons by minimum age
  http.get('/persons/age/:minAge', ({ params }) => {
    const { minAge } = params;
    
    const age = parseInt(minAge as string, 10);
    if (isNaN(age) || age < 0) {
      return HttpResponse.json(
        { error: 'minAge must be a non-negative integer' },
        { status: 400 }
      );
    }

    const persons = getPersonsByMinimumAge(age);
    return HttpResponse.json(persons);
  }),
];

export default handlers;
