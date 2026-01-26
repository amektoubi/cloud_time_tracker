# Agent Guidelines for Cloud Time Tracker

This document provides guidelines for AI agents working on the Time Tracker System codebase.

## Project Overview

A **Local-First, Cloud-Sync** time tracking application with:
- **Frontend:** React + Vite, Zustand state management, Bootstrap 5 UI, Capacitor for mobile
- **Backend:** Quarkus (Java 21+), Hibernate Panache, REST API with WebSocket signaling
- **Database:** SQLite (local/mobile), PostgreSQL or SQLite (server)
- **Architecture:** Offline-first with eventual consistency, client-side UUIDs, Last-Write-Wins conflict resolution

## Build, Lint, and Test Commands

### Frontend (React/Vite)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting (ESLint)
npm run lint

# Run type checking (TypeScript)
npm run typecheck

# Run tests
npm run test

# Run a single test file
npm run test -- --testPathPattern="TimeEntryRepository"

# Run tests in watch mode
npm run test -- --watch
```

### Backend (Quarkus/Java)

```bash
# Build the project
./mvnw clean package

# Run development mode (live reload)
./mvnw quarkus:dev

# Run tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=TimeEntryServiceTest

# Run tests with coverage
./mvnw test -Djacoco=true

# Lint/format check (if configured)
./mvnw checkstyle:check
```

### Infrastructure

```bash
# Start all services via Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose build --no-cache
```

### Development Environment (Devbox)

This project uses [Devbox](https://www.jetify.com/devbox) to provide reproducible development environments.

```bash
# Install devbox (if not already installed)
curl -fsSL https://get.jetify.com/devbox | bash

# Enter the devbox environment
devbox shell

# Run commands inside devbox environment
devbox run -- npm install
devbox run -- ./mvnw clean package

# Generate devbox.json (first-time setup)
devbox init

# Add packages to devbox.json
devbox add nodejs@25.4.0
devbox add javaPackages.compiler.openjdk21@21.0.9+10

# Check which packages are installed
devbox list
```

Devbox ensures all developers have the same versions of Node.js, Java, and other tools required for the project.

## Code Style Guidelines

### General Principles

- **Local-First:** All data operations target local storage first; sync is secondary
- **Offline-Capable:** Features must work without network connectivity
- **Eventual Consistency:** Accept that data may briefly diverge across devices
- **Optimistic UI:** Update UI immediately, handle sync failures gracefully

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| TypeScript interfaces | PascalCase with `I` prefix | `ITimeEntry`, `ICategory` |
| TypeScript types | PascalCase | `SyncStatus`, `UserRole` |
| Database entities | PascalCase | `TimeEntry`, `Category` |
| Database tables | snake_case | `time_entries`, `sync_queue` |
| Columns/Fields | snake_case | `client_timestamp`, `is_deleted` |
| UUIDs | Lowercase | `550e8400-e29b-41d4-a716-446655440000` |
| REST endpoints | kebab-case | `/api/v1/time-entries` |
| State stores (Zustand) | camelCase with `Store` suffix | `useAuthStore`, `useSyncStore` |

### Imports and Dependencies

- Use absolute imports for project modules: `import { TimeEntry } from '@/entities/time-entry'`
- Use relative imports for sibling files: `import { validate } from './validation'`
- Group imports in this order: React → Third-party → Internal → Relative
- Avoid barrel files (`index.ts`) for deeply nested components
- Use named exports exclusively: `export const createTimeEntry = (...)`

### TypeScript/JavaScript

```typescript
// Prefer interfaces over types for entity definitions
interface TimeEntry {
  id: UUID;
  categoryId: UUID;
  startTime: ISO8601Timestamp;
  endTime?: ISO8601Timestamp;
  description?: string;
  isDeleted: boolean;
  clientTimestamp: ISO8601Timestamp;
}

// Use readonly for immutable data
interface Category {
  readonly id: UUID;
  readonly userId: UUID;
  readonly name: string;
  readonly colorHex: string;
}

// Avoid 'any' - use 'unknown' with type guards
function handlePayload(payload: unknown): TimeEntry {
  if (!isTimeEntry(payload)) {
    throw new Error('Invalid payload');
  }
  return payload;
}
```

### Java (Quarkus)

- Use records for DTOs: `public record TimeEntryDTO(UUID id, ...) { }`
- Follow package structure: `com.cloudtimestracker.domain.entity`
- Use Lombok annotations to reduce boilerplate: `@Entity @Data`
- Repository interfaces extend `PanacheRepositoryBase<Entity, UUID>`
- Validation annotations on DTOs: `@NotNull @Size(max = 50)`

### Error Handling

- **Frontend:** Wrap async operations in try/catch; show user-friendly toasts
- **Sync Failures:** Queue for retry, mark record with `sync_failed` status
- **Backend:** Return appropriate HTTP codes (400 validation, 401 auth, 409 conflict)
- **Offline Errors:** Log locally, sync when connectivity returns
- **Never expose stack traces to clients in production**

### Synchronization Rules

1. All entities use **client-generated UUID v4** as primary key
2. Every mutation includes `client_timestamp` for conflict resolution
3. Use **soft deletes** (`is_deleted=true`) to propagate deletions
4. Last-Write-Wins based on `client_timestamp` (tie-break: lexicographical client ID)
5. Reject timestamps with >5 minutes drift from server time

### Database Patterns

- **Frontend:** Direct SQL via `sql.js` or SQLite plugin; use repositories for abstraction
- **Backend:** Hibernate Panache; avoid raw SQL for dialect portability
- **Local Cache:** 7-day rolling window for time entries; always sync categories/tags
- **Sync Queue:** Persistent `sync_queue` table with `PENDING`, `IN_FLIGHT`, `FAILED` states

### Security

- Never log or expose user data in error messages
- Hash passwords with Argon2id (backend)
- Validate JWTs on every protected endpoint
- Enforce row-level security via `user_id` from JWT
- Sanitize all user inputs to prevent injection

### Git Workflow

- Commit messages follow conventional format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Keep commits atomic and focused
- Create feature branches from `main`: `feat/description` or `fix/issue-number`
