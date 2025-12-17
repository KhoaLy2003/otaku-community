# Interaction Module

This module handles social interactions for posts including likes and comments.

## Features

### Like System
- Users can like/unlike published posts
- Prevents duplicate likes from the same user
- Maintains denormalized like counts on posts for performance
- Supports guest users viewing like counts (but not liking)

### Comment System
- Users can create, edit, and delete comments on published posts
- Comments support soft deletion to maintain data integrity
- Comments are ordered by creation time (ascending)
- Maintains denormalized comment counts on posts for performance
- Users can only edit/delete their own comments

## Entities

### Like
- Unique constraint on (post_id, user_id) to prevent duplicate likes
- Tracks creation timestamp for analytics
- Automatically managed creation time

### Comment
- Extends BaseEntity for soft delete support
- Content limited to 1000 characters
- Supports parent_id for future nested comments feature
- Tracks creation and update timestamps

## API Endpoints

### Likes
- `POST /api/interactions/likes` - Like a post
- `DELETE /api/interactions/likes/{postId}` - Unlike a post
- `GET /api/interactions/likes/{postId}` - Get like status (public)

### Comments
- `POST /api/interactions/comments` - Create a comment
- `PUT /api/interactions/comments/{commentId}` - Update own comment
- `DELETE /api/interactions/comments/{commentId}` - Delete own comment (soft delete)
- `GET /api/interactions/comments/{commentId}` - Get specific comment
- `GET /api/interactions/posts/{postId}/comments` - Get all comments for a post
- `GET /api/interactions/posts/{postId}/comments/paginated` - Get comments with pagination

## Security

- Like/comment creation requires authentication (`USER` role)
- Comment editing/deletion requires ownership verification
- Like status and comment viewing is public (no authentication required)
- Guest users can view likes and comments but cannot interact

## Performance Optimizations

- Denormalized counters (likesCount, commentsCount) on Post entity
- Database indexes on frequently queried columns
- Lazy loading for entity relationships
- Pagination support for comment lists

## Error Handling

- `400 Bad Request` - Duplicate likes, invalid data
- `401 Unauthorized` - Missing authentication for protected operations
- `403 Forbidden` - Insufficient permissions (editing others' comments)
- `404 Not Found` - Post/comment not found or soft deleted

## Future Enhancements

- Nested comment replies (parent_id field already exists)
- Comment reactions (beyond just likes)
- Comment moderation features
- Real-time notifications for interactions