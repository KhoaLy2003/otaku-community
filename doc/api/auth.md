# Authentication API Documentation

## Overview
This document describes the authentication endpoints for the Japan Community Social Platform.

## Base URL
```
/api/auth
```

## Endpoints

### 1. Register
**Endpoint:** `POST /api/auth/register`
**Authentication:** None
**Description:** Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "anime_lover",
  "password": "SecurePassword123!"
}
```

**Validation:**
- `email`: Required, valid email format, unique
- `username`: Required, 3-30 characters, alphanumeric and underscores only, unique
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, and number

**Response:** `201 Created`
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "anime_lover",
    "avatar": null,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data or validation errors
- `409 Conflict`: Email or username already exists

---

### 2. Login
**Endpoint:** `POST /api/auth/login`
**Authentication:** None
**Description:** Authenticates a user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "anime_lover",
    "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
    "bio": "Anime enthusiast from Tokyo",
    "interests": ["Anime", "Manga", "JLPT Learning"],
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account has been banned

---

### 3. Refresh Token
**Endpoint:** `POST /api/auth/refresh`
**Authentication:** Refresh Token Required
**Description:** Generates a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Error Responses:**
- `400 Bad Request`: Missing refresh token
- `401 Unauthorized`: Invalid or expired refresh token

---

### 4. Logout
**Endpoint:** `POST /api/auth/logout`
**Authentication:** Required (JWT)
**Description:** Invalidates the current refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User
**Endpoint:** `GET /api/auth/me`
**Authentication:** Required (JWT)
**Description:** Returns the currently authenticated user's information.

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "anime_lover",
  "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
  "bio": "Anime enthusiast from Tokyo",
  "interests": ["Anime", "Manga", "JLPT Learning"],
  "location": "Tokyo, Japan",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token

---

## Token Information

### Access Token
- **Type:** JWT (JSON Web Token)
- **Expiration:** 1 hour
- **Usage:** Include in Authorization header as `Bearer <token>`
- **Claims:** user_id, email, username, role

### Refresh Token
- **Type:** JWT (JSON Web Token)
- **Expiration:** 7 days
- **Usage:** Used to obtain new access tokens
- **Storage:** Should be stored securely (httpOnly cookie recommended)

## Security Notes
- Passwords are hashed using bcrypt with 10 salt rounds
- Tokens are signed using HS256 algorithm
- Refresh tokens should be rotated on each use (optional enhancement)
- Failed login attempts should be rate-limited
- Passwords must meet complexity requirements
- Email verification is not required in MVP (future enhancement)
