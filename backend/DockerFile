# backend/Dockerfile

###############
# Build stage #
###############
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy everything from backend/
COPY . .

# Build Spring Boot jar with Gradle wrapper
RUN chmod +x ./gradlew && ./gradlew clean bootJar --no-daemon

################
# Runtime stage #
################
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar
COPY --from=build /app/build/libs/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
