# Interaction Controller API

The Interaction Controller handles all user interactions with posts, specifically likes and comments.

## Endpoints

### Like Endpoints

---

#### 1. Like a Post

-   **Description:** Adds a like to a specific post.
-   **Method:** `POST`
-   **URL:** `/api/interactions/likes`
-   **Authorization:** User role required.
-   **Request Body:**
    ```json
    {
        "postId": "UUID"
    }
    ```
-   **Responses:**
    -   `201 CREATED`: Post liked successfully.
    -   `400 BAD REQUEST`: If the post is already liked or the request is invalid.
    -   `404 NOT FOUND`: If the post does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Post liked successfully",
        "data": {
            "postId": "UUID",
            "liked": true
        }
    }
    ```

---

#### 2. Unlike a Post

-   **Description:** Removes a like from a specific post.
-   **Method:** `DELETE`
-   **URL:** `/api/interactions/likes/{postId}`
-   **Authorization:** User role required.
-   **URL Parameters:**
    -   `postId` (UUID): The ID of the post to unlike.
-   **Responses:**
    -   `200 OK`: Post unliked successfully.
    -   `400 BAD REQUEST`: If the post is not liked or the request is invalid.
    -   `404 NOT FOUND`: If the post does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Post unliked successfully",
        "data": {
            "postId": "UUID",
            "liked": false
        }
    }
    ```

---

#### 3. Get Like Status

-   **Description:** Retrieves the like status of a post for the current user. Works for both authenticated and guest users.
-   **Method:** `GET`
-   **URL:** `/api/interactions/likes/{postId}`
-   **URL Parameters:**
    -   `postId` (UUID): The ID of the post.
-   **Responses:**
    -   `200 OK`: Like status retrieved successfully.
    -   `404 NOT FOUND`: If the post does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Like status retrieved successfully",
        "data": {
            "postId": "UUID",
            "liked": true
        }
    }
    ```

---

### Comment Endpoints

---

#### 1. Create a Comment

-   **Description:** Adds a comment to a specific post.
-   **Method:** `POST`
-   **URL:** `/api/interactions/comments`
-   **Authorization:** User role required.
-   **Request Body:**
    ```json
    {
        "postId": "UUID",
        "content": "string",
        "parentId": "UUID" // Optional
    }
    ```
-   **Responses:**
    -   `201 CREATED`: Comment created successfully.
    -   `400 BAD REQUEST`: If the comment data is invalid.
    -   `404 NOT FOUND`: If the post does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Comment created successfully",
        "data": {
            "id": "UUID",
            "postId": "UUID",
            "content": "string",
            "author": {
                "id": "UUID",
                "username": "string",
                "avatar": "string"
            },
            "createdAt": "datetime",
            "updatedAt": "datetime",
            "parentId": "UUID" // Optional
        }
    }
    ```

---

#### 2. Update a Comment

-   **Description:** Updates an existing comment. Users can only update their own comments.
-   **Method:** `PUT`
-   **URL:** `/api/interactions/comments/{commentId}`
-   **Authorization:** User role required.
-   **URL Parameters:**
    -   `commentId` (UUID): The ID of the comment to update.
-   **Request Body:**
    ```json
    {
        "content": "string"
    }
    ```
-   **Responses:**
    -   `200 OK`: Comment updated successfully.
    -   `400 BAD REQUEST`: If the comment data is invalid.
    -   `403 FORBIDDEN`: If the user is not authorized to update the comment.
    -   `404 NOT FOUND`: If the comment does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Comment updated successfully",
        "data": {
            "id": "UUID",
            "postId": "UUID",
            "content": "string",
            "author": {
                "id": "UUID",
                "username": "string",
                "avatar": "string"
            },
            "createdAt": "datetime",
            "updatedAt": "datetime",
            "parentId": "UUID" // Optional
        }
    }
    ```

---

#### 3. Delete a Comment

-   **Description:** Deletes an existing comment. Users can only delete their own comments. This is a soft delete.
-   **Method:** `DELETE`
-   **URL:** `/api/interactions/comments/{commentId}`
-   **Authorization:** User role required.
-   **URL Parameters:**
    -   `commentId` (UUID): The ID of the comment to delete.
-   **Responses:**
    -   `200 OK`: Comment deleted successfully.
    -   `403 FORBIDDEN`: If the user is not authorized to delete the comment.
    -   `404 NOT FOUND`: If the comment does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Comment deleted successfully",
        "data": null
    }
    ```

---

#### 4. Get Post Comments

-   **Description:** Retrieves all comments for a specific post.
-   **Method:** `GET`
-   **URL:** `/api/posts/{postId}/comments`
-   **URL Parameters:**
    -   `postId` (UUID): The ID of the post.
-   **Responses:**
    -   `200 OK`: Comments retrieved successfully.
    -   `404 NOT FOUND`: If the post does not exist.
-   **Success Response Body:**
    ```json
    {
        "message": "Comments retrieved successfully",
        "data": [
            {
                "id": "UUID",
                "postId": "UUID",
                "content": "string",
                "author": {
                    "id": "UUID",
                    "username": "string",
                    "avatar": "string"
                },
                "createdAt": "datetime",
                "updatedAt": "datetime",
                "parentId": "UUID" // Optional
            }
        ]
    }
    ```
