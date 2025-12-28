# Post Controller API

The Post Controller handles the creation, retrieval, updating, and deletion of posts, including their associated media.

## Endpoints

### Post Management Endpoints

---

#### 1. Create a New Post with File Uploads

- **Description:** Creates a new post and allows for the immediate upload of media files.
- **Method:** `POST`
- **URL:** `/api/posts`
- **Content Type:** `multipart/form-data`
- **Authorization:** Authenticated user required.
- **Request Parameters (as form-data):**
  - `title` (String): The title of the post. (Required)
  - `content` (String): The main content/body of the post. (Optional)
  - `status` (String): The status of the post (e.g., `DRAFT`, `PUBLISHED`). Defaults to `DRAFT`. (Optional)
  - `files` (List<MultipartFile>): A list of media files (images, videos, GIFs) to upload with the post. (Optional)
  - `topicIds` (List<UUID>): A list of UUIDs representing topics associated with the post. (Optional)
- **Responses:**
  - `201 CREATED`: Post created successfully.
  - `400 BAD REQUEST`: Invalid request data or files.
  - `401 UNAUTHORIZED`: Authentication required.
- **Success Response Body:**
  ```json
  {
    "message": "Post created successfully",
    "data": {
      "id": "UUID",
      "title": "string",
      "content": "string",
      "status": "DRAFT | PUBLISHED",
      "authorId": "UUID",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "media": [
        {
          "id": "UUID",
          "url": "string",
          "type": "IMAGE | VIDEO | GIF",
          "order": 0
        }
      ],
      "topics": [
        {
          "id": "UUID",
          "name": "string"
        }
      ]
    }
  }
  ```

---

#### 2. Update a Post

- **Description:** Updates an existing post owned by the current user.
- **Method:** `PUT`
- **URL:** `/api/posts/{postId}`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to update.
- **Request Body:**
  ```json
  {
    "title": "string",
    "content": "string",
    "status": "DRAFT | PUBLISHED",
    "topicIds": ["UUID"]
  }
  ```
- **Responses:**
  - `200 OK`: Post updated successfully.
  - `400 BAD REQUEST`: Invalid request data.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
      "message": "Post updated successfully",
      "data": {
          "id": "UUID",
          "title": "string",
          "content": "string",
          "status": "DRAFT | PUBLISHED",
          "authorId": "UUID",
          "createdAt": "datetime",
          "updatedAt": "datetime",
          "media": [ ... ], // Existing media, if any
          "topics": [ ... ] // Existing topics, if any
      }
  }
  ```

---

#### 3. Delete a Post

- **Description:** Soft deletes a post owned by the current user.
- **Method:** `DELETE`
- **URL:** `/api/posts/{postId}`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to delete.
- **Responses:**
  - `200 OK`: Post deleted successfully.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
    "message": "Post deleted successfully",
    "data": null
  }
  ```

---

#### 4. Get Detailed Post Information

- **Description:** Retrieves complete post details, including comments, topics, and like status.
- **Method:** `GET`
- **URL:** `/api/posts/{postId}/detail`
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to retrieve.
- **Responses:**
  - `200 OK`: Post details retrieved successfully.
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
      "message": "Post details retrieved successfully",
      "data": {
          "id": "UUID",
          "title": "string",
          "content": "string",
          "status": "DRAFT | PUBLISHED",
          "authorId": "UUID",
          "createdAt": "datetime",
          "updatedAt": "datetime",
          "media": [ ... ],
          "topics": [ ... ],
          "comments": [ ... ], // List of CommentResponse objects
          "likesCount": 0,
          "isLiked": false // True if the current user has liked the post
      }
  }
  ```

---

#### 5. Get Posts by User

- **Description:** Retrieves a list of posts created by a specific user.
- **Method:** `GET`
- **URL:** `/api/posts/user/{username}`
- **URL Parameters:**
  - `username` (string): The username of the user whose posts to retrieve.
- **Query Parameters:**
  - `cursor` (optional, string): Cursor for pagination.
  - `limit` (optional, integer): Number of posts to return (max 50).
- **Responses:**
  - `200 OK`: Posts retrieved successfully.
- **Response:**
  - **On Success (200 OK):**
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

#### 6. Publish a Post

- **Description:** Changes the status of a draft post to `PUBLISHED`, making it visible.
- **Method:** `POST`
- **URL:** `/api/posts/{postId}/publish`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to publish.
- **Responses:**
  - `200 OK`: Post published successfully.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
      "message": "Post published successfully",
      "data": {
          "id": "UUID",
          "title": "string",
          "content": "string",
          "status": "PUBLISHED",
          "authorId": "UUID",
          "createdAt": "datetime",
          "updatedAt": "datetime",
          "media": [ ... ],
          "topics": [ ... ]
      }
  }
  ```

---

#### 7. Convert Post to Draft

- **Description:** Changes the status of a published post back to `DRAFT`.
- **Method:** `POST`
- **URL:** `/api/posts/{postId}/draft`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to convert to draft.
- **Responses:**
  - `200 OK`: Post converted to draft successfully.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
      "message": "Post converted to draft successfully",
      "data": {
          "id": "UUID",
          "title": "string",
          "content": "string",
          "status": "DRAFT",
          "authorId": "UUID",
          "createdAt": "datetime",
          "updatedAt": "datetime",
          "media": [ ... ],
          "topics": [ ... ]
      }
  }
  ```

---

#### 8. Check Post Ownership

- **Description:** Checks if the current authenticated user owns the specified post.
- **Method:** `GET`
- **URL:** `/api/posts/{postId}/owner`
- **Authorization:** Authenticated user required.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to check ownership for.
- **Responses:**
  - `200 OK`: Ownership check completed.
  - `401 UNAUTHORIZED`: Authentication required.
- **Success Response Body:**
  ```json
  {
    "message": "success",
    "data": true // or false
  }
  ```

### Media Endpoints

---

#### 1. Upload Media Files for a Post

- **Description:** Uploads multiple media files (images, videos, GIFs) for an existing post.
- **Method:** `POST`
- **URL:** `/api/posts/{postId}/media/upload`
- **Content Type:** `multipart/form-data`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to add media to.
- **Request Parameters (as form-data):**
  - `files` (List<MultipartFile>): A list of media files to upload. (Required)
- **Responses:**
  - `201 CREATED`: Media uploaded successfully.
  - `400 BAD REQUEST`: Invalid file or request.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
    "message": "Media uploaded successfully",
    "data": [
      {
        "id": "UUID",
        "url": "string",
        "type": "IMAGE | VIDEO | GIF",
        "order": 0
      }
    ]
  }
  ```

---

#### 2. Add Media from URLs

- **Description:** Adds media to a post from existing URLs (e.g., external image links).
- **Method:** `POST`
- **URL:** `/api/posts/{postId}/media`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post to add media to.
- **Request Body:**
  ```json
  [
    {
      "url": "string",
      "type": "IMAGE | VIDEO | GIF"
    }
  ]
  ```
- **Responses:**
  - `201 CREATED`: Media added successfully.
  - `400 BAD REQUEST`: Invalid request data.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
    "message": "Media added successfully",
    "data": [
      {
        "id": "UUID",
        "url": "string",
        "type": "IMAGE | VIDEO | GIF",
        "order": 0
      }
    ]
  }
  ```

---

#### 3. Get Post Media

- **Description:** Retrieves all media items associated with a specific post.
- **Method:** `GET`
- **URL:** `/api/posts/{postId}/media`
- **URL Parameters:**
  - `postId` (UUID): The ID of the post whose media to retrieve.
- **Responses:**
  - `200 OK`: Media retrieved successfully.
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
    "message": "Media retrieved successfully",
    "data": [
      {
        "id": "UUID",
        "url": "string",
        "type": "IMAGE | VIDEO | GIF",
        "order": 0
      }
    ]
  }
  ```

---

#### 4. Update Media Order

- **Description:** Updates the display order of media items within a post.
- **Method:** `PUT`
- **URL:** `/api/posts/{postId}/media/order`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post whose media order to update.
- **Request Body:**
  ```json
  [
    "UUID_media_id_1",
    "UUID_media_id_2"
    // ... ordered list of all media IDs for the post
  ]
  ```
- **Responses:**
  - `200 OK`: Media order updated successfully.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post not found.
- **Success Response Body:**
  ```json
  {
    "message": "Media order updated successfully",
    "data": [
      {
        "id": "UUID",
        "url": "string",
        "type": "IMAGE | VIDEO | GIF",
        "order": 0
      }
    ]
  }
  ```

---

#### 5. Delete Post Media

- **Description:** Deletes a specific media item from a post.
- **Method:** `DELETE`
- **URL:** `/api/posts/{postId}/media/{mediaId}`
- **Authorization:** Authenticated user required, and must be the post owner.
- **URL Parameters:**
  - `postId` (UUID): The ID of the post from which to delete media.
  - `mediaId` (UUID): The ID of the media item to delete.
- **Responses:**
  - `200 OK`: Media deleted successfully.
  - `401 UNAUTHORIZED`: Authentication required.
  - `403 FORBIDDEN`: Access denied (not post owner).
  - `404 NOT FOUND`: Post or media not found.
- **Success Response Body:**
  ```json
  {
    "message": "Media deleted successfully",
    "data": null
  }
  ```
