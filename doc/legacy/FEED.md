# Feed Module

This module implements the feed generation system for the Japan Community Social Platform, providing different types of content feeds with cursor-based pagination.

## Features

### Feed Types

1. **Home Feed** (`/api/feed/home`)
   - Personalized feed for authenticated users
   - Shows posts from followed users and topics
   - Currently returns empty feed until user following system is implemented
   - Requires authentication

2. **Explore Feed** (`/api/feed/explore`)
   - Public feed showing all published posts
   - Available to both authenticated and guest users
   - Sorted by creation time (newest first)

3. **Topic Feed** (`/api/feed/topic/{topicId}`)
   - Shows posts associated with a specific topic
   - Available to both authenticated and guest users
   - Sorted by creation time (newest first)

### Pagination

All feeds use **cursor-based pagination** for consistent results:

- **Page Size**: Default 20 posts, maximum 50 posts per request
- **Cursor Format**: Base64-encoded string containing `createdAt:postId`
- **Ordering**: Posts sorted by `createdAt DESC, id DESC` for stable pagination
- **Consistency**: No duplicates or missing posts even when new content is added

#### Cursor Algorithm

1. **First Request**: No cursor parameter needed
2. **Subsequent Requests**: Use `nextCursor` from previous response
3. **Cursor Construction**: `Base64(createdAt:postId)` of last post in current page
4. **Query Logic**: 
   ```sql
   WHERE (created_at < cursorCreatedAt) 
      OR (created_at = cursorCreatedAt AND id < cursorPostId)
   ORDER BY created_at DESC, id DESC
   ```

## API Endpoints

### GET /api/feed/home
- **Authentication**: Required (USER role)
- **Parameters**: 
  - `cursor` (optional): Pagination cursor
  - `limit` (optional): Number of posts (max 50)
- **Response**: `FeedResponse` with posts, nextCursor, and hasMore flag

### GET /api/feed/explore
- **Authentication**: Not required
- **Parameters**: 
  - `cursor` (optional): Pagination cursor
  - `limit` (optional): Number of posts (max 50)
- **Response**: `FeedResponse` with posts, nextCursor, and hasMore flag

### GET /api/feed/topic/{topicId}
- **Authentication**: Not required
- **Parameters**: 
  - `topicId` (path): UUID of the topic
  - `cursor` (optional): Pagination cursor
  - `limit` (optional): Number of posts (max 50)
- **Response**: `FeedResponse` with posts, nextCursor, and hasMore flag

## Data Models

### FeedResponse
```java
{
  "posts": [PostResponse],      // Array of post objects
  "nextCursor": "string",       // Base64 cursor for next page
  "hasMore": boolean,           // Whether more posts are available
  "totalCount": number          // Number of posts in current response
}
```

## Implementation Details

### Service Layer (`FeedService`)
- Handles business logic for all feed types
- Implements cursor parsing and generation
- Manages pagination limits and validation
- Integrates with PostRepository for data access

### Controller Layer (`FeedController`)
- REST endpoints for feed access
- Request validation and parameter handling
- Security annotations for authentication
- OpenAPI documentation

### Repository Layer
- Custom queries in `PostRepository` for cursor-based pagination
- Optimized queries with proper indexing
- Soft delete handling (excludes deleted posts)

## Database Queries

The feed system uses optimized queries with proper indexing:

```sql
-- Explore feed (first page)
SELECT * FROM posts 
WHERE deleted_at IS NULL AND status = 'PUBLISHED'
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Explore feed (with cursor)
SELECT * FROM posts 
WHERE deleted_at IS NULL AND status = 'PUBLISHED'
  AND (created_at < ? OR (created_at = ? AND id < ?))
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Topic feed
SELECT p.* FROM posts p 
JOIN post_topics pt ON p.id = pt.post_id
WHERE p.deleted_at IS NULL AND p.status = 'PUBLISHED' 
  AND pt.topic_id = ?
ORDER BY p.created_at DESC, p.id DESC
LIMIT 20;
```

## Performance Considerations

1. **Indexes**: Proper database indexes on `(status, created_at)` and `(created_at, id)`
2. **Cursor Pagination**: Avoids OFFSET-based pagination performance issues
3. **Lazy Loading**: Post relationships loaded only when needed
4. **Caching**: Ready for Redis caching implementation for popular feeds

## Future Enhancements

1. **User Following**: Home feed will be populated once user following system is implemented
2. **Algorithmic Feeds**: Support for engagement-based sorting algorithms
3. **Feed Caching**: Redis caching for frequently accessed feeds
4. **Real-time Updates**: WebSocket integration for live feed updates
5. **Content Filtering**: User preferences and content filtering options

## Testing

The module includes comprehensive unit tests covering:
- Feed generation logic
- Cursor-based pagination
- Parameter validation
- Error handling scenarios
- Edge cases (empty feeds, invalid cursors)

Run tests with: `mvn test -Dtest=FeedServiceTest`