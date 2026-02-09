# Stage 1: Builder
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /home/cloudtimestracker

# Copy pom.xml first for dependency caching
COPY pom.xml .
COPY back/pom.xml ./back/pom.xml

# Copy source code
COPY back/src ./back/src

# Build the application (skip tests for container build)
RUN cd back && ./mvnw clean package -DskipTests -Dquarkus.package.type=quarkus-app

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

# Create non-root user for security
RUN addgroup -S cloudtimestracker && adduser -S cloudtimestracker -G cloudtimestracker

WORKDIR /home/cloudtimestracker

# Copy the built application from builder stage
COPY --from=builder /home/cloudtimestracker/back/target/quarkus-app /home/cloudtimestracker

# Change ownership to non-root user
RUN chown -R cloudtimestracker:cloudtimestracker /home/cloudtimestracker

USER cloudtimestracker

# Expose application port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "quarkus-run.jar"]
