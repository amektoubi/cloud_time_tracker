# Project Context & Technology Stack

## 1. Project Overview

**Name:** Cloud Time Tracker
**Type:** Local-First SaaS / Cross-Platform Mobile & Web Application
**Core Goal:** A self-hostable time tracking application with offline-first architecture and bidirectional cloud synchronization. Supports Web (PWA) and Mobile (iOS/Android via Capacitor), following a unified frontend strategy where a single React codebase compiles to both platforms.

## 2. Technology Stack (STRICT)

### Frontend

* **Framework:** React 19.2.0
* **Language:** TypeScript 5.9.3 (Strict Mode)
* **Styling:** Bootstrap 5.3.8, Bootstrap Icons 1.13.1, CSS Modules
* **State Management:** Redux Toolkit 2.11.2 (current), Zustand 5.0.11 (available but not active)
* **Routing:** React Router DOM 7.13.0
* **Mobile Runtime:** Capacitor 8.0.2 (Android ^8.0.2, iOS implicitly supported)
* **Build Tool:** Vite 7.2.4
* **Testing:** Vitest 4.0.0, Playwright 1.52.0, React Testing Library 16.3.2, MSW 2.12.9
* **HTTP Client:** Axios 1.13.4
* **Form Handling:** React Hook Form 7.71.1

### Backend

* **Runtime/Language:** Java 21 (Quarkus 3.30.8 - "Supersonic Subatomic Java")
* **Database:** PostgreSQL 16 (Production), SQLite (Development/Lite Profile), H2 (Testing)
* **ORM/Data Access:** Hibernate Panache (quarkus-hibernate-orm-panache)
* **Database Migration:** Flyway (quarkus-flyway) - supports both SQLite and PostgreSQL dialects
* **Security/Auth:** SmallRye JWT (quarkus-smallrye-jwt) - Stateless JWT authentication
* **API Protocol:** RESTful via JAX-RS (Quarkus REST / RESTEasy)
* **Testing:** JUnit 5, Testcontainers (PostgreSQL), Mockito, REST-assured

## 3. Architecture Patterns

* **Frontend Pattern:** Feature-based / Atomic Design (components organized by domain: `components/person/`, `components/ErrorBoundary.tsx`)
* **Backend Pattern:** Repository Pattern (Panache Repository), DTO Pattern, Service Layer Pattern
* **API Style:** RESTful (JAX-RS)
* **Sync Strategy:** Local-First with Offline Sync Queue - Optimistic UI updates with eventual consistency
* **Multi-Tenancy:** Logical multi-tenancy with `user_id` filtering (Row-Level Isolation)
* **Conflict Resolution:** Last-Write-Wins based on client-side timestamps

## 4. Directory Structure

```
/
├── front/                    # React SPA application (Vite-based)
│   ├── src/
│   │   ├── components/      # Feature-based components (person/, shared/)
│   │   ├── stores/         # Redux store & slices (personSlice.ts, store.ts)
│   │   ├── services/       # API service (api.ts)
│   │   ├── mocks/          # MSW mocks for testing
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions (date.ts)
│   │   └── App.tsx         # Root component
│   └── dist/               # Built production assets
├── back/                     # Quarkus REST API
│   ├── src/main/java/ma/time/traker/
│   │   ├── api/
│   │   │   ├── domain/     # Entity classes (Person.java)
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── resource/    # REST endpoints (PersonResource.java)
│   │   │   ├── repository/  # Panache repositories
│   │   │   └── service/     # Business logic services
│   │   └── exception/      # Exception handlers
│   ├── src/main/resources/
│   │   ├── db/migration/   # Flyway migrations (sqlite/, postgresql/)
│   │   └── application.properties
│   └── src/test/           # Integration tests
├── docker-compose.yml       # PostgreSQL + pgAdmin
├── documentation/          # VitePress docs site (FRD.md, DAD.md)
├── .opencode/              # OpenCode agent config (skills/, agents/, rules/)
├── devbox.json             # Devbox environment definition
└── .devcontainer/          # VS Code Dev Container config
```

## 5. Coding Standards (Critical)

* **Naming:** PascalCase for Components/Classes, camelCase for functions/variables/files
* **Comments:** JSDoc/JavaDoc required for public methods, components, and DTOs
* **Testing:** Vitest for Frontend, JUnit 5 + Testcontainers for Backend. Minimum 80% coverage on critical paths.
* **TypeScript:** Strict mode enabled - no implicit `any`. Use `unknown` with type guards when necessary.
* **Imports:** Relative imports for internal modules (`../../components/...`), package imports for third-party libs
* **State:** Use Redux Toolkit slices for state management. Async operations via `createAsyncThunk`.
* **Error Handling:** Global `ErrorBoundary` for React. Backend uses `GlobalExceptionHandler` with `ErrorResponse` DTOs.
* **API Error Responses:** Structured JSON with `error_code`, `message`, and optional `details` fields.

## 6. Infrastructure & Deployment (DevOps Context)

* **Container Strategy:** Docker Compose (Local Development)
    * PostgreSQL 16 Alpine (primary database)
    * pgAdmin 4 (database administration UI)
* **Build Strategy:** Multi-stage Docker builds for production (JVM mode for dev, Native/GraalVM for production)
* **Cloud Provider:** Self-hostable (target: any Linux host, Raspberry Pi compatible - RAM budget <512MB)
* **CI/CD Provider:** GitHub Actions (not yet configured)
* **IaC Tooling:** Shell Scripts / Devbox (Nix-based environment)
* **Database Profiles:** 
    * `test-postgres`: Integration tests with Testcontainers
    * `test-sqlite`: Lightweight tests
    * `dev`: PostgreSQL via docker-compose
* **Health Checks:** Quarkus provides `/q/health/live` and `/q/health/ready` endpoints
* **Environment Management:** Devbox 0.16.0 with Node.js 25.4.0, Java 21, Playwright 1.57.0

## 7. Key Domain Entities (from FRD/DAD)

* **Person** - User identity (stubbed in current MVP)
* **TimeEntry** - Core tracking entity (start_time, end_time, duration, category)
* **Category** - Classification buckets for time tracking
* **Tag** - Granular labels (many-to-many with TimeEntry)
* **User** - Authentication & authorization entity (role: Standard/Admin)

## 8. Reference Documentation

* **FRD.md** - Functional Requirements Document (detailed user stories, NFRs)
* **DAD.md** - Design & Architecture Document (C4 diagrams, sync protocol, security)
* **DAD.md - Chapter 5:** Data Architecture (Entity schemas, 7-day rolling cache)
* **DAD.md - Chapter 6:** Synchronization Design (Sync Queue, Conflict Resolution)
