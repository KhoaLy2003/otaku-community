# Activity API

This API provides endpoints for retrieving user activity and login history.

## Authentication

All endpoints require authentication. The API uses a bearer token for authentication.

## Endpoints

### Get Login History

- **GET** `/api/v1/activity/login-history`
- **Description**: Retrieves a paginated list of login history records for the current user.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
    - `limit` (optional, integer, default: 20): The number of items per page.
- **Responses**:
    - `200 OK`: Login history retrieved successfully.
      ```json
      {
        "message": "Login history retrieved successfully",
        "data": {
          "items": [
            {
              "id": "c3a8c8a0-0b7f-4b1a-8b0a-0e1b0b2a0c1a",
              "ipAddress": "192.168.1.1",
              "userAgent": "Chrome on Windows",
              "createdAt": "2024-07-27T10:00:00Z"
            }
          ],
          "totalItems": 1,
          "totalPages": 1,
          "currentPage": 1,
          "cursor": null
        }
      }
      ```
    - `401 Unauthorized`: User not authenticated.

### Get Activity Log

- **GET** `/api/v1/activity/log`
- **Description**: Retrieves a paginated list of activity log records for the current user.
- **Query Parameters**:
    - `page` (optional, integer, default: 1): The page number for pagination.
    - `limit` (optional, integer, default: 20): The number of items per page.
- **Responses**:
    - `200 OK`: Activity log retrieved successfully.
      ```json
      {
        "message": "Activity log retrieved successfully",
        "data": {
          "items": [
            {
              "id": "d4b9d9b0-1c8g-5c2b-9c1b-1f2c1d3b1e2b",
              "actionType": "CREATE_POST",
              "metadata": "{\"postId\":\"e5c0e0c0-2d9h-6d3c-0d2c-2g3d2e4c2f3c\"}",
              "createdAt": "2024-07-27T10:00:00Z"
            }
          ],
          "totalItems": 1,
          "totalPages": 1,
          "currentPage": 1,
          "cursor": null
        }
      }
      ```
    - `401 Unauthorized`: User not authenticated.
