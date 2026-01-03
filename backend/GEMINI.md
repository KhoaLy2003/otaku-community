# GEMINI.md

This file provides a comprehensive overview of the Otaku Community Backend project for the Gemini CLI.

## Project Overview

This is the backend for a social platform for the otaku community. It is a Spring Boot application written in Java 17. The project uses Maven as its build tool, PostgreSQL for the database, and Auth0 for authentication. It also integrates with Cloudinary for media storage.

The project follows a modular structure, with features such as user management, posts, topics, comments, likes, follows, notifications, and a user feed.

### Key Technologies

*   **Java**: 17
*   **Spring Boot**: 3.2.1
*   **Database**: PostgreSQL
*   **ORM**: JPA/Hibernate
*   **Authentication**: Auth0
*   **Image Storage**: Cloudinary
*   **API Documentation**: Springdoc OpenAPI (Swagger)
*   **Build Tool**: Maven

## Building and Running

### Prerequisites

*   Java 17 or higher
*   Maven 3.8+
*   PostgreSQL 14+
*   Auth0 account
*   Cloudinary account

### Setup and Run

1.  **Configure Environment**:
    The project requires environment variables for the database, Auth0, and Cloudinary. These can be set in a `.env` file or as system environment variables. The `README.md` file contains a list of all required variables.

2.  **Build the Project**:
    ```bash
    mvn clean install
    ```

3.  **Run the Application**:
    ```bash
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
    ```

### Running Tests

To run the test suite, use the following command:

```bash
mvn test
```

## Development Conventions

*   **Code Style**: The project follows standard Java conventions.
    *   Indentation: 4 spaces
    *   Line length: 120 characters
*   **Lombok**: The project uses Lombok to reduce boilerplate code.
*   **MapStruct**: MapStruct is used for DTO mapping.
*   **Feature Modules**: New features are organized into modules under the `src/main/java/com/otaku/community/feature` package.
*   **Database Migrations**: The project uses `spring.jpa.hibernate.ddl-auto=update` for development. For production, it is recommended to use a migration tool like Flyway or Liquibase.

## API Documentation

The API documentation is generated using Springdoc OpenAPI and is available at the following endpoints when the application is running:

*   **Swagger UI**: `http://localhost:3001/api/swagger-ui.html`
*   **OpenAPI JSON**: `http://localhost:3001/api/docs`
