FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven descriptor and resolve dependencies
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source and build application
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built Spring Boot jar
COPY --from=build /app/target/biddora-backend.jar app.jar

# Expose application port (matches server.port in application.properties)
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]