# Feed API Document

This document describes the API for the Feed feature.

## API Response Structure

All successful API responses are wrapped in a standardized JSON object:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

- `success`: A boolean indicating whether the request was successful.
- `message`: A string providing a human-readable message about the result.
- `data`: The payload of the response. This will vary depending on the endpoint.

For failed requests, the structure is:
```json
{
  "success": false,
  "message": "string"
}
```

## Base Path

The base path for all feed-related endpoints is `/feed`.

---

## Endpoints

### Get Home Feed

-   **Method:** `GET`
-   **Path:** `/home`
-   **Description:** Get personalized home feed for authenticated user.
-   **Authentication:** Required (USER role).
-   **Query Parameters:**
    -   `cursor` (optional, string): Cursor for pagination.
    -   `limit` (optional, integer): Number of posts to return (max 50).
-   **Response:**
    -   **On Success (200 OK):**
        ```json
        {
          "success": true,
          "data": {
            "posts": [
              {
                "id": "uuid",
                "title": "string",
                "content": "string",
                "image": "string (url)",
                "author": {
                  "id": "uuid",
                  "name": "string",
                  "avatar": "string (url)"
                },
                "createdAt": "datetime",
                "likeCount": "integer",
                "commentCount": "integer"
              }
            ],
            "nextCursor": "string",
            "hasMore": "boolean",
            "totalCount": "integer"
          },
          "message": null
        }
        ```
    -   **On Failure (401 Unauthorized):**
        ```json
        {
          "success": false,
          "message": "Authentication required"
        }
        ```

---

### Get Explore Feed

-   **Method:** `GET`
-   **Path:** `/explore`
-   **Description:** Get public explore feed with all published posts.
-   **Authentication:** Not required.
-   **Query Parameters:**
    -   `cursor` (optional, string): Cursor for pagination.
    -   `limit` (optional, integer): Number of posts to return (max 50).
    -   `topicIds` (optional, list of uuids): Filter posts by topic IDs.
-   **Response:**
    -   **On Success (200 OK):**
        ```json
        {
          "success": true,
          "data": {
            "posts": [
              {
                "id": "uuid",
                "title": "string",
                "content": "string",
                "image": "string (url)",
                "author": {
                  "id": "uuid",
                  "name": "string",
                  "avatar": "string (url)"
                },
                "createdAt": "datetime",
                "likeCount": "integer",
                "commentCount": "integer"
              }
            ],
            "nextCursor": "string",
            "hasMore": "boolean",
            "totalCount": "integer"
          },
          "message": null
        }
        ```

---

## Feed Caching (Future Enhancement)

For better performance, feeds will be cached using Redis:

**Cache Strategy:**
- Home feed cached for 5 minutes per user
- Explore feed cached for 2 minutes globally
- Topic feeds cached for 5 minutes per topic
- Cache invalidated on new post creation
- Cache invalidated on follow/unfollow actions

---

## Feed Personalization (Future Enhancement)

Future versions will include more sophisticated feed algorithms:

**Planned Features:**
- Machine learning-based content recommendations
- Engagement-based ranking (not just chronological)
- Diversity injection (mix of different topics)
- Freshness boost for new users
- Downranking of low-quality content
- User preference learning
- A/B testing different algorithms

---

## Notes
- All feeds exclude soft-deleted posts
- All feeds exclude posts from banned users
- The `isLiked` field is only present when user is authenticated
- Guests can view explore and topic feeds but not home feed
- Feed pagination uses cursor-based pagination for better performance (future enhancement)
- Real-time feed updates via WebSockets (future enhancement)
- Feed filters by date range (future enhancement)
- Save/bookmark posts (future enhancement)
- Hide/mute specific posts or users from feed (future enhancement)
