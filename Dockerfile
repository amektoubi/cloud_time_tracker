# Multi-stage build for Cloud Time Tracker
# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy frontend source and build
COPY front/ .
RUN npm install && npm run build

# Stage 2: Build Quarkus backend with embedded frontend
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build

WORKDIR /workspace

# Copy backend source
COPY back/pom.xml .
COPY back/src ./src

# Copy frontend build to resources
COPY --from=frontend-build /app/dist ./src/main/resources/META-INF/resources

# Build backend JAR
RUN mvn clean package -DskipTests

# Stage 3: Final runtime image
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user for security
RUN addgroup -g 1000 appgroup && \
  adduser -u 1000 -G appgroup -D appuser

# Set working directory
WORKDIR /deployments

# Copy JAR from build stage
COPY --from=backend-build --chown=appuser:appgroup /workspace/target/quarkus-app/ ./

RUN ln -s quarkus-app/quarkus-run.jar app.jar && chown appuser:appgroup app.jar


# Switch to non-root user
USER appuser

# Create a symlink for the JAR file (Quarkus convention)

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Set JVM options for optimal performance
ENV JAVA_OPTS="-Xmx256m -Xms128m -XX:+UseSerialGC"

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
