# Otaku Community Backend

Spring Boot backend for the Japan Community Social Platform.

## Tech Stack

- **Java**: 17
- **Spring Boot**: 3.2.1
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Authentication**: Auth0
- **Image Storage**: Cloudinary
- **API Documentation**: Springdoc OpenAPI (Swagger)
- **Build Tool**: Maven

## Project Structure

```
backend/
├── src/main/java/com/otaku/community/
│   ├── OtakuCommunityApplication.java
│   ├── common/                    # Shared infrastructure
│   │   ├── config/               # Configuration classes
│   │   ├── controller/           # Common controllers (health check)
│   │   ├── dto/                  # Common DTOs
│   │   ├── entity/               # Base entities
│   │   ├── exception/            # Exception handling
│   │   └── util/                 # Utility classes
│   └── feature/                  # Feature modules
│       ├── user/                 # User management
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── mapper/
│       │   ├── repository/
│       │   └── service/
│       ├── post/                 # Post management (TODO)
│       ├── topic/                # Topic management (TODO)
│       ├── comment/              # Comment management (TODO)
│       ├── like/                 # Like management (TODO)
│       ├── follow/               # Follow management (TODO)
│       ├── notification/         # Notification management (TODO)
│       └── feed/                 # Feed generation (TODO)
└── src/main/resources/
    ├── application.yml
    ├── application-dev.yml
    └── application-prod.yml
```

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 14+
- Auth0 account
- Cloudinary account

## Setup

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.prod.example .env.prod
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/otaku_community
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Create Database

```bash
createdb otaku_community

# Or using psql
psql -U postgres
CREATE DATABASE otaku_community;
\q
```

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
# Development mode
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or with environment variables
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

The API will be available at `http://localhost:3001/api`

## API Documentation

Once the application is running, access the Swagger UI at:

```
http://localhost:3001/api/swagger-ui.html
```

OpenAPI JSON specification:

```
http://localhost:3001/api/docs
```

## Available Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile (authenticated)
- `GET /api/users/search?q={query}` - Search users

## Development

### Running Tests

```bash
mvn test
```

### Code Style

The project uses standard Java code conventions. Ensure your IDE is configured with:
- Indentation: 4 spaces
- Line length: 120 characters
- Use Lombok annotations

### Adding a New Feature Module

1. Create package structure under `feature/`:
   ```
   feature/
   └── your-feature/
       ├── controller/
       ├── dto/
       ├── entity/
       ├── mapper/
       ├── repository/
       └── service/
   ```

2. Follow the existing patterns:
   - Entities extend `BaseEntity`
   - Use MapStruct for DTO mapping
   - Services handle business logic
   - Controllers handle HTTP requests
   - Repositories handle data access

### Database Migrations

For production, consider using Flyway or Liquibase for database migrations.

Current setup uses `spring.jpa.hibernate.ddl-auto=update` for development.

## Deployment

### Building for Production

```bash
mvn clean package -DskipTests
```

The JAR file will be in `target/community-backend-1.0.0.jar`

### Running in Production

```bash
java -jar target/community-backend-1.0.0.jar --spring.profiles.active=prod
```

### Environment Variables for Production

Ensure these are set in your production environment:
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `AUTH0_DOMAIN`
- `AUTH0_AUDIENCE`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CORS_ALLOWED_ORIGINS`

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d otaku_community
```

### Auth0 Configuration

Ensure your Auth0 application is configured with:
- Application Type: Regular Web Application
- Allowed Callback URLs: Your frontend URL
- Allowed Web Origins: Your frontend URL
- JWT Expiration: 3600 seconds (1 hour)

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

## Next Steps

Implement remaining feature modules:
- [ ] Post management
- [ ] Topic management
- [ ] Comment management
- [ ] Like management
- [ ] Follow management
- [ ] Notification system
- [ ] Feed generation
- [ ] Admin panel

## License

MIT
