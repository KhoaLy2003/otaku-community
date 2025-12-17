# Post and Feed System API Testing Guide

## Overview

This guide provides comprehensive documentation for testing the Post and Feed System API endpoints using Postman. The system includes endpoints for posts, feeds, interactions (likes/comments), topics, and media uploads.

## Base Configuration

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: Bearer Token (JWT from Auth0)
- **Content-Type**: `application/json` (except for media uploads)

## Authentication Setup

### Getting an Auth Token

1. **Login via Auth0**: Use the frontend application at `http://localhost:3000` to login
2. **Extract JWT**: The JWT token will be available in the browser's local storage or via the `/api/auth/token` endpoint
3. **Set Bearer Token**: In Postman, go to Authorization tab and select "Bearer Token", then paste your JWT

### Test User Setup

For testing, you'll need:
- At least one registered user account
- Admin privileges for topic management endpoints
- Valid Auth0 JWT tokens

## API Endpoints Documentation

### 1. Posts API (`/api/posts`)

#### Create Post
- **Method**: `POST`
- **Endpoint**: `/api/posts`
- **Auth**: Required (Bearer Token)
- **Body**:
```json
{
  "title": "My First Post",
  "content": "This is the content of my post",
  "mediaUrls": ["https://example.com/image1.jpg"],
  "topicIds": ["550e8400-e29b-41d4-a716-446655440000"],
  "status": "PUBLISHED"
}
```

#### Get Post by ID
- **Method**: `GET`
- **Endpoint**: `/api/posts/{postId}`
- **Auth**: Not required
- **Example**: `/api/posts/550e8400-e29b-41d4-a716-446655440000`

#### Get Post Details
- **Method**: `GET`
- **Endpoint**: `/api/posts/{postId}/detail`
- **Auth**: Not required
- **Returns**: Complete post with comments, topics, and like status

#### Update Post
- **Method**: `PUT`
- **Endpoint**: `/api/posts/{postId}`
- **Auth**: Required (Owner only)
- **Body**:
```json
{
  "title": "Updated Post Title",
  "content": "Updated content",
  "mediaUrls": ["https://example.com/updated-image.jpg"],
  "topicIds": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

#### Delete Post
- **Method**: `DELETE`
- **Endpoint**: `/api/posts/{postId}`
- **Auth**: Required (Owner only)

#### Get Published Posts
- **Method**: `GET`
- **Endpoint**: `/api/posts`
- **Auth**: Not required
- **Query Parameters**:
  - `page`: Page number (1-based, default: 1)
  - `size`: Page size (max 20, default: 20)

#### Get Posts by User
- **Method**: `GET`
- **Endpoint**: `/api/posts/user/{userId}`
- **Auth**: Not required
- **Query Parameters**:
  - `status`: Filter by status (DRAFT, PUBLISHED)
  - `page`: Page number (1-based, default: 1)
  - `size`: Page size (max 20, default: 20)

#### Publish Post
- **Method**: `POST`
- **Endpoint**: `/api/posts/{postId}/publish`
- **Auth**: Required (Owner only)

#### Convert to Draft
- **Method**: `POST`
- **Endpoint**: `/api/posts/{postId}/draft`
- **Auth**: Required (Owner only)

#### Check Post Ownership
- **Method**: `GET`
- **Endpoint**: `/api/posts/{postId}/owner`
- **Auth**: Required

### 2. Feed API (`/api/feed`)

#### Get Home Feed
- **Method**: `GET`
- **Endpoint**: `/api/feed/home`
- **Auth**: Required
- **Query Parameters**:
  - `cursor`: Pagination cursor (optional)
  - `limit`: Number of posts (max 50, optional)

#### Get Explore Feed
- **Method**: `GET`
- **Endpoint**: `/api/feed/explore`
- **Auth**: Not required
- **Query Parameters**:
  - `cursor`: Pagination cursor (optional)
  - `limit`: Number of posts (max 50, optional)

#### Get Topic Feed
- **Method**: `GET`
- **Endpoint**: `/api/feed/topic/{topicId}`
- **Auth**: Not required
- **Query Parameters**:
  - `cursor`: Pagination cursor (optional)
  - `limit`: Number of posts (max 50, optional)

### 3. Interactions API (`/api/interactions`)

#### Like a Post
- **Method**: `POST`
- **Endpoint**: `/api/interactions/likes`
- **Auth**: Required
- **Body**:
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Unlike a Post
- **Method**: `DELETE`
- **Endpoint**: `/api/interactions/likes/{postId}`
- **Auth**: Required

#### Get Like Status
- **Method**: `GET`
- **Endpoint**: `/api/interactions/likes/{postId}`
- **Auth**: Not required (but returns more info if authenticated)

#### Create Comment
- **Method**: `POST`
- **Endpoint**: `/api/interactions/comments`
- **Auth**: Required
- **Body**:
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "This is a great post!"
}
```

#### Update Comment
- **Method**: `PUT`
- **Endpoint**: `/api/interactions/comments/{commentId}`
- **Auth**: Required (Owner only)
- **Body**:
```json
{
  "content": "Updated comment content"
}
```

#### Delete Comment
- **Method**: `DELETE`
- **Endpoint**: `/api/interactions/comments/{commentId}`
- **Auth**: Required (Owner only)

#### Get Comment
- **Method**: `GET`
- **Endpoint**: `/api/interactions/comments/{commentId}`
- **Auth**: Not required

#### Get Post Comments
- **Method**: `GET`
- **Endpoint**: `/api/interactions/posts/{postId}/comments`
- **Auth**: Not required

#### Get Post Comments (Paginated)
- **Method**: `GET`
- **Endpoint**: `/api/interactions/posts/{postId}/comments/paginated`
- **Auth**: Not required
- **Query Parameters**:
  - `page`: Page number (0-based)
  - `size`: Page size (default: 20)

### 4. Topics API (`/api/topics`)

#### Create Topic (Admin Only)
- **Method**: `POST`
- **Endpoint**: `/api/topics`
- **Auth**: Required (Admin role)
- **Body**:
```json
{
  "name": "Anime Discussion",
  "description": "General anime discussion and recommendations",
  "color": "#FF5733",
  "isDefault": false
}
```

#### Get All Topics
- **Method**: `GET`
- **Endpoint**: `/api/topics`
- **Auth**: Not required

#### Get Default Topics
- **Method**: `GET`
- **Endpoint**: `/api/topics/default`
- **Auth**: Not required

#### Search Topics
- **Method**: `GET`
- **Endpoint**: `/api/topics/search`
- **Auth**: Not required
- **Query Parameters**:
  - `query`: Search term (required)
  - `page`: Page number (1-based, default: 1)
  - `limit`: Page size (default: 20)

#### Get Topic by ID
- **Method**: `GET`
- **Endpoint**: `/api/topics/{topicId}`
- **Auth**: Not required

#### Get Topic by Slug
- **Method**: `GET`
- **Endpoint**: `/api/topics/slug/{slug}`
- **Auth**: Not required

#### Update Topic (Admin Only)
- **Method**: `PUT`
- **Endpoint**: `/api/topics/{topicId}`
- **Auth**: Required (Admin role)
- **Body**:
```json
{
  "name": "Updated Topic Name",
  "description": "Updated description",
  "color": "#00FF00"
}
```

#### Delete Topic (Admin Only)
- **Method**: `DELETE`
- **Endpoint**: `/api/topics/{topicId}`
- **Auth**: Required (Admin role)

#### Get Topics by Post
- **Method**: `GET`
- **Endpoint**: `/api/topics/post/{postId}`
- **Auth**: Not required

### 5. Media API (`/media`)

#### Upload Media
- **Method**: `POST`
- **Endpoint**: `/media/upload`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `file` field containing the media file
- **Supported formats**: JPEG, PNG, GIF, WebP, MP4
- **Max size**: 5MB

#### Delete Media
- **Method**: `DELETE`
- **Endpoint**: `/media/{publicId}`
- **Auth**: Required

## Testing Scenarios

### Basic Workflow Test

1. **Authentication**: Get JWT token and set up Bearer auth
2. **Create Topic**: Create a test topic (admin required)
3. **Upload Media**: Upload a test image
4. **Create Post**: Create a post with the uploaded media and topic
5. **Get Feeds**: Test home, explore, and topic feeds
6. **Interact**: Like and comment on the post
7. **Update Post**: Modify the post content
8. **Delete**: Clean up by deleting the post

### Guest User Test

1. **Get Explore Feed**: Should work without authentication
2. **Get Post Details**: Should work without authentication
3. **Try to Like**: Should return 401 Unauthorized
4. **Try to Comment**: Should return 401 Unauthorized

### Error Handling Test

1. **Invalid Data**: Send malformed JSON or missing required fields
2. **Unauthorized Access**: Try to edit/delete other users' posts
3. **Not Found**: Request non-existent resources
4. **File Upload Errors**: Upload invalid file types or oversized files

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "path": "/api/posts"
}
```

## Environment Variables

Set up these Postman environment variables:

- `baseUrl`: `http://localhost:8080/api`
- `authToken`: Your JWT token
- `testUserId`: A valid user UUID
- `testPostId`: A valid post UUID
- `testTopicId`: A valid topic UUID

## Import Instructions

1. Download the `Post_Feed_System_API.postman_collection.json` file
2. Open Postman
3. Click "Import" button
4. Select the downloaded JSON file
5. Set up environment variables as described above
6. Start testing!

## Notes

- The server must be running on `localhost:8080`
- Database must be properly configured and accessible
- Auth0 configuration must be set up for authentication to work
- Cloudinary configuration must be set up for media uploads
- Some endpoints require admin privileges - ensure your test user has appropriate roles