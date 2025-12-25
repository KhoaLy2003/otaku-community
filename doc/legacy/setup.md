# Development Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v14.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code (recommended)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd japan-community-platform
```

### 2. Backend Setup

#### Option A: NestJS Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
# Edit .env file with your settings
```

**Backend Environment Variables (.env):**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/japan_community

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Option B: Spring Boot Backend

```bash
# Navigate to backend directory
cd backend

# Copy application properties template
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Configure application properties
# Edit application.properties with your settings
```

**Backend Application Properties:**
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/japan_community
spring.datasource.username=your-username
spring.datasource.password=your-password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-super-secret-jwt-key-change-this
jwt.expiration=3600000

# Cloudinary
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret

# Server
server.port=3001
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb japan_community

# Or using psql
psql -U postgres
CREATE DATABASE japan_community;
\q

# Run migrations (NestJS with Prisma)
cd backend
npx prisma migrate dev

# Or (Spring Boot with JPA)
# Migrations run automatically on startup
```

**Initial Database Seed (Optional):**
```bash
# Seed predefined topics
npm run seed

# Or manually insert topics
psql -U postgres -d japan_community
INSERT INTO topics (id, name, slug, description, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Anime', 'anime', 'Discuss your favorite anime series', NOW(), NOW()),
  (gen_random_uuid(), 'Manga', 'manga', 'Share and discuss manga', NOW(), NOW()),
  (gen_random_uuid(), 'JLPT Learning', 'jlpt-learning', 'Japanese language learning resources', NOW(), NOW()),
  (gen_random_uuid(), 'Japan Culture', 'japan-culture', 'Traditional and modern Japanese culture', NOW(), NOW()),
  (gen_random_uuid(), 'Japan Food', 'japan-food', 'Japanese cuisine and recipes', NOW(), NOW()),
  (gen_random_uuid(), 'Japan Travel', 'japan-travel', 'Travel tips and experiences in Japan', NOW(), NOW()),
  (gen_random_uuid(), 'Japanese Life & Work', 'japanese-life-work', 'Living and working in Japan', NOW(), NOW());
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Configure environment variables
# Edit .env.local with your settings
```

**Frontend Environment Variables (.env.local):**
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# App
NEXT_PUBLIC_APP_NAME=Otaku Community
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Create an upload preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Configure folder and transformations as needed
   - Save the preset name

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend

# NestJS
npm run start:dev

# Spring Boot
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api/docs (if Swagger configured)

### Production Build

**Backend:**
```bash
cd backend

# NestJS
npm run build
npm run start:prod

# Spring Boot
./mvnw clean package
java -jar target/japan-community-backend.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## Database Management

### Prisma Commands (NestJS)

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration-name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### JPA/Hibernate Commands (Spring Boot)

```bash
# Generate SQL from entities
./mvnw hibernate:schema-export

# Validate schema
./mvnw hibernate:schema-validate
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Quality

### Linting

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

### Formatting

```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Type Checking

```bash
# Backend (TypeScript)
cd backend
npm run type-check

# Frontend
cd frontend
npm run type-check
```

## Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill the process using the port
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

**3. Prisma Client Not Generated**
```
Error: Cannot find module '@prisma/client'
```
**Solution:** Generate Prisma Client
```bash
npx prisma generate
```

**4. Environment Variables Not Loaded**
```
Error: JWT_SECRET is not defined
```
**Solution:** Ensure .env file exists and is properly formatted

**5. Cloudinary Upload Fails**
```
Error: Upload preset not found
```
**Solution:** Create unsigned upload preset in Cloudinary dashboard

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Prisma (for NestJS)
- Spring Boot Extension Pack (for Spring Boot)
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (API testing)

### Database Tools

- **Prisma Studio**: Built-in GUI for Prisma
- **pgAdmin**: PostgreSQL administration
- **DBeaver**: Universal database tool
- **TablePlus**: Modern database GUI

### API Testing Tools

- **Thunder Client**: VS Code extension
- **Postman**: Standalone application
- **Insomnia**: REST client
- **curl**: Command-line tool

## Next Steps

After setup is complete:

1. Create a test user account
2. Explore the API endpoints
3. Create sample posts and topics
4. Test social features (likes, comments, follows)
5. Review the codebase structure
6. Read the API documentation
7. Start implementing new features

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
