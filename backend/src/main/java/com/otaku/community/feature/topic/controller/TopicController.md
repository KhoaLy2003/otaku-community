# Topic Controller API

The Topic Controller handles operations related to topics, including creation, retrieval, updates, and deletion.

## Endpoints

### Topic Management Endpoints

---

#### 1. Create a new topic

-   **Description:**
-   **Method:** `POST`
-   **URL:** `/api/topics`
-   **Authorization:**
-   **Request Body:**
    ```json

    ```
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```
---

#### 2. Update topic

-   **Description:**
-   **Method:** `PUT`
-   **URL:** `/api/topics/{topicId}`
-   **Authorization:**
-   **Request Body:**
    ```json

    ```
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```
---

#### 3. Delete topic

-   **Description:**
-   **Method:** `DELETE`
-   **URL:** `/api/topics/{topicId}`
-   **Authorization:**
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```

### Topic Retrieval Endpoints

---

#### 1. Get Default Topics

-   **Description:** Retrieves system-defined default topics.
-   **Method:** `GET`
-   **URL:** `/api/topics/default`
-   **Authorization:** None required.
-   **Responses:**
    -   `200 OK`: Default topics retrieved successfully.
-   **Success Response Body:**
    ```json
    {
        "message": "Default topics retrieved successfully",
        "data": [
            {
                "id": "UUID",
                "name": "string",
                "slug": "string",
                "description": "string",
                "color": "string",
                "isDefault": "boolean",
                "postsCount": "long",
                "createdAt": "datetime",
                "updatedAt": "datetime"
            }
        ]
    }
    ```

---

#### 2. Get all topics

-   **Description:**
-   **Method:** `GET`
-   **URL:** `/api/topics`
-   **Authorization:**
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```

---

#### 3. Search topics

-   **Description:**
-   **Method:** `GET`
-   **URL:** `/api/topics/search`
-   **Authorization:**
-   **Request Body:**
    ```json

    ```
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```

---

#### 4. Get topic by ID

-   **Description:**
-   **Method:** `GET`
-   **URL:** `/api/topics/{topicId}`
-   **Authorization:**
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```

---

#### 5. Get topic by slug

-   **Description:**
-   **Method:** `GET`
-   **URL:** `/api/topics/slug/{slug}`
-   **Authorization:**
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```

---

#### 6. Get topics by post ID

-   **Description:**
-   **Method:** `GET`
-   **URL:** `/api/topics/post/{postId}`
-   **Authorization:**
-   **Responses:**
-   **Success Response Body:**
    ```json

    ```
