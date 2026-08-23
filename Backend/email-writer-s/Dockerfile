# Multi-stage build for MailGenie Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Build application artifact
COPY src ./src
RUN mvn -B clean package -DskipTests

# Minimal runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
