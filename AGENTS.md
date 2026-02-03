# Agent Guidelines for Cloud Time Tracker

Local-First, Cloud-Sync time tracking app with React/Vite frontend and Quarkus backend.

## Current Project State
**Status**: Initial setup phase - Using default Vite template with basic React 19 + TypeScript configuration
**Last Updated**: February 2026

## Build Commands

### Frontend (`front/`)
```bash
npm install                    # install dependencies
npm run dev                    # start dev server (Vite)
npm run build                  # production build (TypeScript + Vite)
npm run lint                   # ESLint analysis
npm run test                   # run all tests (TODO: Add Vitest configuration)
npm run test -- PersonForm     # run single test file (TODO: Add test files)
npm run test -- --run          # run tests once (no watch)
npm run preview                # preview production build
```

**Current Dependencies:**
- React 19.2.0 (latest)
- TypeScript 5.9.3
- Vite 7.2.4
- Bootstrap 5.3.8
- React Bootstrap 2.10.10
- Zustand 5.0.11 (state management)
- ESLint 9.39.1 with TypeScript support

**Missing Dependencies to Add:**
- `react-hook-form` - Form validation
- `vitest` - Testing framework
- `@testing-library/react` - React testing utilities
- `@testing-library/user-event` - User interaction testing
- Additional UI libraries as needed

**Current Code Status:**
- Project is in initial setup phase using default Vite template
- No actual time tracking components implemented yet
- Basic React 19 + TypeScript configuration
- Bootstrap styling framework configured
- ESLint with TypeScript support configured
- State management library (Zustand) ready for use

### Backend (`back/`)
```bash
./mvnw clean package          # build application
./mvnw quarkus:dev             # dev mode (live reload)
./mvnw test                    # run all tests (JUnit 5)
./mvnw test -Dtest=ClassName  # run single test class
./mvnw test -Djacoco=true     # run tests with coverage
./mvnw verify                 # run integration tests
```

### Devbox
```bash
devbox shell                   # enter development environment
devbox run -- <cmd>            # run command in devbox environment
```

## Code Style Guidelines

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| TS interfaces | PascalCase + `I` prefix | `ITimeEntry`, `IPersonCreate` |
| TS types | PascalCase | `SyncStatus`, `FormMode` |
| React components | PascalCase | `PersonForm`, `PersonList` |
| Entities/DTOs | PascalCase | `TimeEntry`, `PersonResponse` |
| DB tables/cols | snake_case | `time_entries`, `client_timestamp` |
| REST endpoints | kebab-case | `/api/v1/time-entries` |
| Zustand stores | camelCase + `Store` | `useAuthStore` |
| Test files | PascalCase + `.test.tsx` | `PersonForm.test.tsx` |

### Import Organization
- **Relative imports** for siblings: `import { x } from './x'`
- **Relative imports** for parent: `import { x } from '../x'`
- **Import order**: React → Third-party → Internal → Relative
- **Export pattern**: Named exports only: `export const createX = (...)`
- **Path alias**: TODO - Configure in `vite.config.ts` with `@` pointing to `src/`

### TypeScript Guidelines
```typescript
interface ITimeEntry { 
  readonly id: UUID; 
  readonly categoryId: UUID; 
  startTime: ISO8601Timestamp; 
  endTime?: ISO8601Timestamp; 
}

type FormMode = 'create' | 'edit';

// Avoid 'any' - use 'unknown' with type guards
function handlePayload(payload: unknown): TimeEntry {
  if (!isTimeEntry(payload)) throw new Error('Invalid payload');
  return payload;
}

// React components use React.FC
const PersonForm: React.FC<PersonFormProps> = ({ ... }) => {
  // Component implementation
};
```

### React Component Patterns
- Use `React.FC` for functional components
- Define props interfaces with `I` prefix
- Use destructuring for props
- Default optional props: `isLoading = false`
- Use descriptive prop names: `onSubmit`, `onCancel`, `mode`

### Java (Quarkus) Guidelines
- **DTOs**: Use records: `public record TimeEntryDTO(UUID id, ...) { }`
- **Packages**: `com.cloudtimestracker.domain.*`
- **Lombok**: `@Entity @Data`
- **Repositories**: `PanacheRepositoryBase<Entity, UUID>`
- **Validation**: `@NotNull @Size(max = 50)`

### Testing Standards

#### Frontend Testing (Vitest + Testing Library)
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PersonForm', () => {
  describe('Rendering', () => {
    it('renders form in create mode', () => {
      // Test implementation
    });
  });
});
```

- Use descriptive test descriptions
- Group tests with `describe` blocks by functionality
- Mock external dependencies with `vi.mock()`
- Use Testing Library queries: `getByRole`, `getByLabelText`
- Test accessibility: proper labels, ARIA attributes
- Include error scenarios and edge cases

#### Backend Testing (JUnit 5)
- Use `@Test` annotations
- Group integration tests with `@Tag("integration")`
- Use TestContainers for database tests
- Mock with Mockito: `@Mock`, `@InjectMocks`

### Form Validation & Error Handling
- **Frontend**: Use react-hook-form with validation rules
- **Validation**: Display user-friendly error messages
- **Error handling**: try/catch + user feedback
- **Sync failures**: queue for retry, mark `sync_failed`
- **Backend**: Proper HTTP codes (400, 401, 409)
- **Production**: Never expose stack traces

### Sync & Data Management Rules
- **Client-generated** UUID v4 for all entities
- **Include** `client_timestamp` on every mutation
- **Soft deletes**: Use `is_deleted=true`
- **Conflict resolution**: Last-Write-Wins (tie: lexicographical client ID)
- **Timestamp validation**: Reject >5min server drift

### Security Requirements
- **Password hashing**: Use Argon2id
- **JWT validation**: On all protected endpoints
- **Row-level security**: Via `user_id` from JWT
- **Input sanitization**: Prevent injection attacks
- **CORS configuration**: Proper origin restrictions

### Code Quality
- **TypeScript strict mode**: Enabled in `tsconfig.app.json`
- **ESLint rules**: Configured in `eslint.config.js`
- **Unused code**: Remove with `noUnusedLocals` and `noUnusedParameters`
- **Consistent formatting**: Follow existing patterns
- **Bootstrap classes**: Use for consistent styling

### Git Workflow
**Conventional commits**: `type(scope): description`
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### File Organization
**Current Structure (Default Vite Template):**
```
src/
├── App.tsx             # Main app component
├── main.tsx           # App entry point
├── App.css            # App styles
├── index.css          # Global styles
└── assets/            # Static assets
    └── react.svg     # React logo
```

**Target Structure (To be implemented):**
```
src/
├── components/          # React components
│   └── person/         # Feature-based folders
├── types/              # TypeScript interfaces
├── stores/             # Zustand stores
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

### Development Workflow
1. Run `npm run lint` before committing
2. Ensure all tests pass: `npm run test` (TODO: Configure tests)
3. Test single components during development (TODO: Add component tests)
4. Use dev server for live feedback: `npm run dev`
5. Build and verify production build: `npm run build && npm run preview`