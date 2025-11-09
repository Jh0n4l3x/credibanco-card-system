# Backend Dockerfile - multi-stage build for the Spring Boot application
# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy only pom first for better layer caching
COPY pom.xml mvnw .mvn/ ./
COPY src ./src

# Use Maven to build the project (skip tests for faster builds; remove -DskipTests to run them)
RUN mvn -B -e -DskipTests package

# Run stage: smaller runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app

# copy the executable jar from the builder stage
COPY --from=build /workspace/target/*.jar app.jar

# Expose port (documentation / convenience). Fly provides $PORT at runtime.
EXPOSE 8080

# Use PORT env if provided by the platform (Fly sets $PORT). Default to 8080 locally.
ENV PORT=8080

# Start the application. Allow overriding Java options via JAVA_OPTS env var.
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
