# Issue #50: US-019: Implement Multi-Stage CI/CD Workflows

## Description
**Priority:** P0 (Critical)
**Type:** DevOps

**As a** DevOps Engineer,
**I want** to implement distinct GitHub Actions workflows for feature branches versus release tags,
**So that** we validate code quality on every push without wasting resources building production artifacts until a release is tagged.

**Acceptance Criteria:**
*   **Workflow A (CI - Pull Requests):** Triggers on push to `main` or any `issue-*` branch. It runs `nx run-many --target=test` and `nx run-many --target=build` to ensure code compiles and unit tests pass for both Frontend and Backend.
*   **Workflow B (CD - Release Tags):** Triggers ONLY when a Git tag (e.g., `v*`) is pushed.
*   **CD Step 1 (Docker):** Builds the Web Frontend, copies assets to Quarkus (`META-INF/resources`), builds the JVM Docker image, and publishes it to the container registry.
*   **CD Step 2 (Mobile):** Sets up the Android environment, runs `npx cap sync`, and builds the Release APK via Gradle.
*   **Artifacts:** The Docker image is available in the registry, and the APK is uploaded as a GitHub Release asset.

## Context
- **Created:** 2026-02-11
- **Status:** Initialized

## Technical Plan

### Architecture
The project uses a standalone Frontend (React/Vite) and Backend (Quarkus/Maven) structure without Nx. We will create two separate GitHub Actions workflows:

- **CI Workflow:** Validates code quality on every push to `main` or `issue-*` branches
- **CD Workflow:** Builds and publishes artifacts only when a version tag is pushed

**Container Registry:** GitHub Container Registry (`ghcr.io`)
**Docker Image Tag:** Matches git tag (e.g., `v1.0.0` → `ghcr.io/user/cloud_time_tracker:v1.0.0`)

**Build Logic:**
- If tag contains "native" (e.g., `v1.0.0-native`) → Build Native/GraalVM image
- Otherwise → Build JVM Docker image

### Frontend Tasks
- [ ] Create `.github/workflows/ci.yml` - CI workflow
- [ ] Create `.github/workflows/cd.yml` - CD workflow

### Backend Tasks
- [ ] Create `Dockerfile` - Multi-stage build for frontend+backend
- [ ] Ensure Quarkus serves static assets from `META-INF/resources`

### Verification
- **Manual Check:** 
  - Push to `issue-50` branch → CI workflow runs
  - Push tag `v1.0.0` → CD workflow builds JVM image
  - Push tag `v1.0.0-native` → CD workflow builds native image
- **Automated Tests:** 
  - CI runs `npm test` and `npm run build` for frontend
  - CI runs `mvn test` and `mvn package` for backend

