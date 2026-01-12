# Deployment Guide

## Prerequisites

- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher
- **Java**: 17+ (for Spring Boot backend)

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/japan_community
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your-super-secret-jwt-key
jwt.expiration=3600000

# Cloudinary
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret

# Server
server.port=3001
```

### Frontend (`frontend/.env.local` or `.env`)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Cloudinary (Client-side)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# App Info
NEXT_PUBLIC_APP_NAME=Otaku Community
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Development

### Backend (Spring Boot)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Run with Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   Server starts at `http://localhost:3001`.

### Frontend (React/Next.js)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
   App accessible at `http://localhost:3000`.

## Database Setup

1. Create PostgreSQL database:
   ```bash
   createdb japan_community
   ```
2. Migrations run automatically on Spring Boot startup (`ddl-auto=update`).
3. (Optional) Seed topics using SQL script provided in `doc/legacy/setup.md`.

## Production Build

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/japan-community-backend.jar
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## Troubleshooting

- **Database Connection:** Ensure Postgres is running on port 5432 and credentials are correct.
- **Port Conflicts:** Ensure ports 3000 and 3001 are free.
- **Cloudinary:** Verify "unsigned" upload preset is created for frontend uploads.
