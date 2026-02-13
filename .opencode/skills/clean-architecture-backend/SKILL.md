# Skill: Clean Backend Architecture & Patterns

## 🎯 Core Principles
You are responsible for building scalable, testable, and secure backend systems using **Layered Architecture** and **Separation of Concerns**.

### 1. The Dependency Rule
*   **Dependencies Point Inwards:** The inner layers (Domain/Entities) MUST NOT know anything about the outer layers (Database/Web Framework).
*   **Abstractions over Implementations:** Business logic depends on *Interfaces* (e.g., `UserRepository`), not concrete classes (e.g., `PostgresUserRepository`).

### 2. The Four Layers
1.  **Presentation (API/Controller):**
    *   *Role:* Handle HTTP requests, parse inputs, return responses.
    *   *Constraint:* **NO BUSINESS LOGIC ALLOWED.** Only validation and delegation to Services.
2.  **Application (Service):**
    *   *Role:* Orchestrate business use cases, manage Transaction boundaries.
    *   *Constraint:* Does not know about HTTP (no `req`/`res` objects).
3.  **Domain (Core):**
    *   *Role:* Pure business rules, Entities, Value Objects.
    *   *Constraint:* Pure code (POJOs/Plain Classes). No framework annotations if possible.
4.  **Infrastructure (Data/External):**
    *   *Role:* Implement Interfaces (Repositories), Database connections, File I/O, 3rd Party APIs.

## 🛠 Mandatory Patterns

### 1. The DTO Pattern (Data Transfer Objects)
*   **Isolation:** NEVER return a Database Entity directly to the client.
*   **Mapping:** 
    *   `RequestDTO` -> `Entity` (for processing)
    *   `Entity` -> `ResponseDTO` (for output)
*   **Why:** Prevents leaking sensitive data (passwords, internal IDs) and decoupling API contract from Database Schema.

### 2. The Repository Pattern
*   **Interface:** Define methods in the Domain layer (e.g., `findActiveUsers()`).
*   **Implementation:** Implement them in the Infrastructure layer using the specific ORM (Hibernate, TypeORM, Prisma, SQLAlchemy).
*   **Constraint:** Do not put SQL queries in Controllers or Services.

### 3. Error Handling (Global)
*   **Custom Exceptions:** Throw semantic exceptions from the Service layer (e.g., `UserNotFoundException`, `InsufficientFundsException`).
*   **Global Handler:** Catch these exceptions in a middleware/filter and map them to appropriate HTTP Status Codes (404, 400, 403).
*   **Sanitization:** Never return raw Stack Traces to the client in production.

## 🚫 Anti-Patterns
1.  **Fat Controllers:** Putting business logic inside the route handler. *Solution: Move to Service.*
2.  **God Services:** A `UserService` with 50 methods. *Solution: Split into `UserRegistrationService`, `UserQueryService` (CQRS).*
3.  **Leaky Abstractions:** Returning an ORM object (like a Hibernate Proxy) that triggers lazy-loading errors in the Controller. *Solution: Map to DTO immediately.*

## 🧪 Testing Strategy
1.  **Unit Tests (Domain/Service):** Mock the Repository. Test the logic in isolation. Fast execution.
2.  **Integration Tests (Controller/Repository):** Spin up a test database container (e.g., Testcontainers). Verify SQL queries and HTTP contracts.
3.  **TDD:** Write the test *before* the implementation whenever complex business logic is involved.
