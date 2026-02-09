# US-017: CI/CD Pipeline for Docker & APK Generation

**Issue Number:** 47
**Priority:** P0 (Critical)
**Type:** DevOps

## Description

As a DevOps Engineer,
I want to configure a GitHub Actions workflow that bundles the Web Frontend into the Backend, generates a Docker image, and compiles the Android APK,
So that we have automated, deployable artifacts for both the server/web users and mobile users upon every release.

## Acceptance Criteria

*   **Web Integration:** The pipeline runs `nx build client-web`, and the resulting static files are copied into the Quarkus Backend resources (`META-INF/resources`) so the backend serves the frontend.
*   **Docker Image:** The pipeline builds the Quarkus application (JVM or Native) containing the web assets and creates a Docker image.
*   **Android APK:** A parallel job in the pipeline sets up the Android SDK, runs `nx build client-mobile`, updates Capacitor (`npx cap sync`), and builds the `.apk` file via Gradle.
*   **Artifacts:** The Docker image is tagged (e.g., `latest` or sha), and the `.apk` file is uploaded as a GitHub Action Artifact for download.

## Plan

- [x] Configure GitHub Actions workflow
- [x] Add web integration step (nx build client-web -> copy to META-INF/resources)
- [x] Add Docker image build step
- [x] Add parallel Android APK build job
- [x] Configure artifact uploads

## Progress Tracking

- [x] Issue detected from branch: issue-47
- [x] Project structure analyzed
- [x] Technical plan created
- [x] GitHub Actions workflow created
- [x] Dockerfile created
- [x] Web integration configured
- [x] Android APK build configured
- [x] Artifact upload configured
- [x] Pipeline tested

## Technical Plan

### Phase 1: Dockerfile Creation

**Files to Create:**
- `back/Dockerfile` - Multi-stage build for Quarkus application

**Dockerfile Structure:**
```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY back/pom.xml .
COPY back/src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /home/cloudtimestracker
COPY --from=builder /build/target/quarkus-app/quarkus-app.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### Phase 2: GitHub Actions Workflow

**File to Create:**
- `.github/workflows/ci-cd.yml`

**Workflow Structure:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  release:
    types: [created]

jobs:
  # Job 1: Build Frontend and Integrate with Backend
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: front/package-lock.json
      - run: cd front && npm install && npm run build
      - run: mkdir -p back/src/main/resources/META-INF/resources
      - run: cp -r front/dist/* back/src/main/resources/META-INF/resources/
      - uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: back/src/main/resources/META-INF/resources

  # Job 2: Build Docker Image
  build-docker:
    runs-on: ubuntu-latest
    needs: build-frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: back/src/main/resources/META-INF/resources
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: back
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}

  # Job 3: Build Android APK (Parallel)
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd front && npm install
      - run: cd front && npm run build
      - run: cd front && npx cap sync android
      - run: cd front/android && ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: front/android/app/build/outputs/apk/debug/
```

### Phase 3: Implementation Steps

1. **Create Dockerfile** (`back/Dockerfile`)
   - Multi-stage build for optimized image size
   - Copy frontend static files to `META-INF/resources`
   - Configure for Quarkus serving

2. **Create GitHub Actions Workflow** (`.github/workflows/ci-cd.yml`)
   - Configure trigger on push/release
   - Add dependency setup (Node.js, Java, Maven)
   - Build frontend with npm
   - Copy frontend dist to backend resources
   - Build Docker image with Buildx
   - Parallel Android build job
   - Upload artifacts (Docker image to registry, APK to GitHub)

3. **Configure Capacitor** (`front/capacitor.config.ts`)
   - Ensure correct Android SDK path configuration
   - Configure signing keys for release builds (future)

4. **Verify Integration**
   - Test that backend serves frontend at root path
   - Verify Docker image contains both backend and frontend
   - Verify APK artifact is downloadable

### Files Modified/Created

| File | Action |
|------|--------|
| `back/Dockerfile` | Create |
| `.github/workflows/ci-cd.yml` | Create |
| `front/capacitor.config.ts` | Verify |

### Verification Commands

```bash
# Local Docker build test
cd back && docker build -t cloud-time-tracker:test .

# Local frontend build
cd front && npm run build

# Verify frontend copied to backend
ls back/src/main/resources/META-INF/resources/
```
