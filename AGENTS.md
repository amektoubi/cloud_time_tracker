# Agent Guidelines for Cloud Time Tracker

Local-First, Cloud-Sync time tracking app with React/Vite frontend and Quarkus backend.

## Build Commands

### Frontend (`front/`)
```bash
npm install
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint
npm run test         # all tests
npm run test -- --testPathPattern="Name"  # single test file
```

### Backend (`back/`)
```bash
./mvnw clean package         # build
./mvnw quarkus:dev           # dev mode (live reload)
./mvnw test                  # all tests
./mvnw test -Dtest=ClassName # single test class
./mvnw test -Djacoco=true    # with coverage
```

### Devbox
```bash
devbox shell                 # enter env
devbox run -- <cmd>          # run command in env
```

## Code Style

### Naming
| Element | Convention | Example |
|---------|-----------|---------|
| TS interfaces | PascalCase + `I` prefix | `ITimeEntry` |
| TS types | PascalCase | `SyncStatus` |
| Entities | PascalCase | `TimeEntry` |
| DB tables/cols | snake_case | `time_entries`, `client_timestamp` |
| REST endpoints | kebab-case | `/api/v1/time-entries` |
| Zustand stores | camelCase + `Store` | `useAuthStore` |

### Imports
- Absolute for project modules: `import { X } from '@/entities/x'`
- Relative for siblings: `import { x } from './x'`
- Order: React → Third-party → Internal → Relative
- Named exports only: `export const createX = (...)`

### TypeScript
```typescript
interface TimeEntry { id: UUID; categoryId: UUID; startTime: ISO8601Timestamp; endTime?: ISO8601Timestamp; }
interface Category { readonly id: UUID; readonly name: string; }
// Avoid 'any' - use 'unknown' with type guards
function handlePayload(payload: unknown): TimeEntry {
  if (!isTimeEntry(payload)) throw new Error('Invalid payload');
  return payload;
}
```

### Java (Quarkus)
- Records for DTOs: `public record TimeEntryDTO(UUID id, ...) { }`
- Package: `com.cloudtimestracker.domain.*`
- Lombok: `@Entity @Data`
- Repos: `PanacheRepositoryBase<Entity, UUID>`
- Validation: `@NotNull @Size(max = 50)`

### Sync & Data Rules
- Client-generated UUID v4 for all entities
- Include `client_timestamp` on every mutation
- Soft deletes (`is_deleted=true`)
- Last-Write-Wins conflict resolution (tie: lexicographical client ID)
- Reject timestamps with >5min server drift

### Error Handling
- Frontend: try/catch + user-friendly toasts
- Sync failures: queue for retry, mark `sync_failed`
- Backend: proper HTTP codes (400, 401, 409)
- Never expose stack traces in production

### Security
- Hash passwords with Argon2id
- Validate JWTs on all protected endpoints
- Row-level security via `user_id` from JWT
- Sanitize inputs against injection

### Git
Conventional commits: `type(scope): description`
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
