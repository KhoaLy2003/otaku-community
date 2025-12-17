# User API Documentation

## Overview
This document describes the user management endpoints for the Japan Community Social Platform.

## Base URL
```
/api/users
```

## Endpoints

### 1. Get User Profile
**Endpoint:** `GET /api/users/:id`
**Authentication:** Optional (affects response data)
**Description:** Retrieves a user's public profile information.

**Path Parameters:**
- `id`: UUID of the user

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "anime_lover",
  "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
  "bio": "Anime enthusiast from Tokyo",
  "interests": ["Anime", "Manga", "JLPT Learning"],
  "location": "Tokyo, Japan",
  "followersCount": 150,
  "followingCount": 75,
  "postsCount": 42,
  "isFollowing": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `404 Not Found`: User does not exist or has been deleted

---

### 2. Update User Profile
**Endpoint:** `PUT /api/users/:id`
**Authentication:** Required (must be the user)
**Description:** Updates the authenticated user's profile.

**Path Parameters:**
- `id`: UUID of the user (must match authenticated user)

**Request Body:**
```json
{
  "username": "new_username",
  "bio": "Updated bio text",
  "interests": ["Anime", "Manga", "Japan Travel"],
  "location": "Osaka, Japan"
}
```

**Validation:**
- `username`: Optional, 3-30 characters, alphanumeric and underscores, unique
- `bio`: Optional, maximum 500 characters
- `interests`: Optional, array of strings, maximum 10 interests
- `location`: Optional, maximum 100 characters

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "new_username",
  "email": "user@example.com",
  "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
  "bio": "Updated bio text",
  "interests": ["Anime", "Manga", "Japan Travel"],
  "location": "Osaka, Japan",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-16T14:20:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User ID does not match authenticated user
- `409 Conflict`: Username already taken

---

### 3. Upload Avatar
**Endpoint:** `POST /api/users/:id/avatar`
**Authentication:** Required (must be the user)
**Description:** Uploads a new avatar image for the user.

**Path Parameters:**
- `id`: UUID of the user

**Request Body:** `multipart/form-data`
```
avatar: <image file>
```

**Validation:**
- File type: JPEG, PNG, GIF, WebP
- Maximum size: 5MB
- Recommended dimensions: 400x400px

**Response:** `200 OK`
```json
{
  "avatar": "https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/user123.jpg"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file type or size
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User ID does not match authenticated user
- `413 Payload Too Large`: File exceeds size limit

---

### 4. Get User's Posts
**Endpoint:** `GET /api/users/:id/posts`
**Authentication:** Optional
**Description:** Retrieves all posts created by a specific user.

**Path Parameters:**
- `id`: UUID of the user

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "content": "Just finished watching Your Name!",
      "images": ["https://res.cloudinary.com/demo/image/upload/post1.jpg"],
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "username": "anime_lover",
        "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
      },
      "topics": [{"id": "...", "name": "Anime", "slug": "anime"}],
      "likesCount": 42,
      "commentsCount": 5,
      "isLiked": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 5. Follow User
**Endpoint:** `POST /api/users/:id/follow`
**Authentication:** Required (JWT)
**Description:** Follows a user. Idempotent operation.

**Path Parameters:**
- `id`: UUID of the user to follow

**Response:** `200 OK`
```json
{
  "success": true,
  "isFollowing": true,
  "followersCount": 151
}
```

**Error Responses:**
- `400 Bad Request`: Cannot follow yourself
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: User does not exist

---

### 6. Unfollow User
**Endpoint:** `DELETE /api/users/:id/follow`
**Authentication:** Required (JWT)
**Description:** Unfollows a user.

**Path Parameters:**
- `id`: UUID of the user to unfollow

**Response:** `200 OK`
```json
{
  "success": true,
  "isFollowing": false,
  "followersCount": 150
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: User does not exist or not following

---

### 7. Get User's Followers
**Endpoint:** `GET /api/users/:id/followers`
**Authentication:** Optional
**Description:** Retrieves a list of users following the specified user.

**Path Parameters:**
- `id`: UUID of the user

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "username": "manga_fan",
      "avatar": "https://res.cloudinary.com/demo/image/upload/avatar2.jpg",
      "bio": "Manga collector",
      "isFollowing": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 8. Get User's Following
**Endpoint:** `GET /api/users/:id/following`
**Authentication:** Optional
**Description:** Retrieves a list of users that the specified user is following.

**Path Parameters:**
- `id`: UUID of the user

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:** Same format as Get User's Followers

---

### 9. Search Users
**Endpoint:** `GET /api/users/search`
**Authentication:** Optional
**Description:** Searches for users by username.

**Query Parameters:**
- `q`: string (required) - Search query
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "anime_lover",
      "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
      "bio": "Anime enthusiast from Tokyo",
      "followersCount": 150,
      "isFollowing": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing search query

---

## Notes
- Email addresses are never exposed in public API responses
- Deleted users return 404 Not Found
- The `isFollowing` field is only present when user is authenticated
- Avatar uploads are processed through Cloudinary
- User statistics (followers, following, posts) are calculated in real-time
- Usernames are case-insensitive for uniqueness but preserve case for display
