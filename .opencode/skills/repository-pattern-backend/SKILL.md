# Repository Pattern Backend Architecture Standard

Framework-agnostic patterns for clean separation between domain logic and data persistence mechanisms. Enables testability, database portability, and maintainable business logic.

---

## 🎯 Core Principles

### 1. Separation of Concerns
- **Domain Models**: Pure business objects with *zero* persistence logic (no ORM annotations, no database dependencies)
- **Repository Interface**: Abstract contract defining *what* data operations exist (not *how*)
- **Repository Implementation**: Concrete adapter translating interface to specific database/ORM
- **Service Layer**: Orchestrates business logic using repository interfaces (never touches ORM directly)

### 2. Persistence Ignorance
- Domain entities must compile and run *without* database drivers or ORM libraries
- Repositories return domain objects, not ORM entities/proxies
- No lazy-loading in domain layer (eager load required data at repository boundary)

### 3. Transaction Boundaries
- Transactions are managed *outside* repositories (typically in service layer)
- Repositories are stateless and transaction-agnostic
- Single repository method = single atomic operation (no implicit transactions)

---

## 🛠 Mandatory Patterns

### Pattern 1: Repository Interface Design
### Pattern 2: Implementation Separation
### Pattern 3: Query Specification Pattern
### Pattern 4: Transaction Management
---

## 🔐 Security & Data Integrity Patterns

### Row-Level Security (Tenant Isolation)
- **Mandatory Filter**: Every query *must* include tenant/user context
- **Implementation**: Inject tenant ID at repository boundary (never trust caller)
### Soft Deletes (Tombstoning)
- **Never hard-delete** user-owned data
- Use `is_deleted` flag + `deleted_at` timestamp
- Repository `findAll()` *excludes* deleted records by default
- Dedicated `findDeleted()` method for admin recovery

---

## 🧪 Testing Strategy

### Unit Testing Services
- Mock repository interfaces (never mock ORM)
- Test business logic in isolation

### Integration Testing Repositories
- Test *only* repository implementations against real database
- Verify:
  - Query correctness (filters, pagination)
  - Transaction boundaries
  - Tenant isolation enforcement
  - Soft delete behavior

---

## ⚠️ Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **Active Record** | Domain objects contain persistence logic (`person.save()`) | Use pure domain models + separate repositories |
| **Leaky Abstractions** | Repository returns ORM entities/proxies | Always map to pure domain objects before returning |
| **Repository Bloat** | 20+ methods per repository (`findByNameAndAgeAndCity...`) | Use Query Specification pattern with filter objects |
| **Transaction in Repo** | Repository manages transaction lifecycle | Move transaction boundaries to service/application layer |
| **N+1 Queries** | Repository methods trigger lazy loads | Eager-load required associations at repository boundary |

---

## 🔄 Framework Adapter Interface

This abstract skill is implemented by framework-specific adapters:

| Adapter | Implements | Location |
|---------|------------|----------|
| `quarkus-panache` | Repository pattern using Panache Repositories | `.opencode/stack-adapters/backend/quarkus-panache/` |
| `nestjs-typeorm` | Repository pattern with TypeORM custom repositories | `.opencode/stack-adapters/backend/nestjs-typeorm/` |
| `fastapi-sqlalchemy` | Repository pattern with SQLAlchemy sessions | `.opencode/stack-adapters/backend/fastapi-sqlalchemy/` |

**Adapter Responsibilities:**
- Translate abstract repository interface to framework-specific implementation
- Handle ORM mapping between domain models and database schema
- Enforce tenant isolation at query level
- Implement transaction propagation for the framework

---

## 📦 Performance Patterns

### Pagination Standard
- **Always require** `page` and `pageSize` parameters (no unbounded queries)
- **Maximum page size**: Enforce server-side limit (e.g., max 100 items)
- **Cursor-based pagination** for infinite scroll/feed scenarios

### Connection Pooling
- Repositories must use connection pooling (never create new connections per request)
- Pool size tuned for expected concurrency (document in `project-context.md`)

### Read/Write Separation
- For high-scale systems: Separate read repositories (optimized queries) from write repositories
- Not required for MVP but design should allow future separation

---

## ✅ Quality Checklist

Before marking a backend task complete:

- [ ] Domain models contain zero ORM/database dependencies
- [ ] Repository interfaces use only domain types (no ORM entities)
- [ ] Tenant isolation enforced at repository implementation level
- [ ] No lazy-loading in returned domain objects
- [ ] All queries include pagination limits
- [ ] Soft deletes implemented (no hard deletes of user data)
- [ ] Transaction boundaries clearly defined in service layer
- [ ] Unit tests mock repository interfaces (not ORM)
- [ ] Integration tests verify tenant isolation works correctly
- [ ] No SQL injection vulnerabilities (parameterized queries only)
