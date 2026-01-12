# Notification API

This API provides endpoints for managing user notifications.

## Authentication

All endpoints require authentication. The API uses a bearer token for authentication.

## Endpoints

### Get Notifications

- **GET** `/api/notifications`
- **Description**: Retrieves a paginated list of notifications for the current user.
- **Query Parameters**:
    - `page` (optional, integer, default: 0): The page number for pagination.
    - `size` (optional, integer, default: 10): The number of items per page.
- **Responses**:
    - `200 OK`: A paginated list of notifications.
      ```json
      {
        "message": "Success",
        "data": {
          "items": [
            {
              "id": "c3a8c8a0-0b7f-4b1a-8b0a-0e1b0b2a0c1a",
              "notificationType": "LIKE",
              "sender": {
                "id": "d4b9d9b0-1c8g-5c2b-9c1b-1f2c1d3b1e2b",
                "username": "user2",
                "avatarUrl": "https://example.com/avatar.jpg"
              },
              "targetId": "e5c0e0c0-2d9h-6d3c-0d2c-2g3d2e4c2f3c",
              "targetType": "POST",
              "preview": "user2 liked your post.",
              "isRead": false,
              "createdAt": "2024-07-27T10:00:00Z"
            }
          ],
          "totalItems": 1,
          "totalPages": 1,
          "currentPage": 0,
          "cursor": null
        }
      }
      ```

### Get Unread Notification Count

- **GET** `/api/notifications/unread-count`
- **Description**: Retrieves the number of unread notifications for the current user.
- **Responses**:
    - `200 OK`: The unread notification count.
      ```json
      {
        "message": "Success",
        "data": {
          "count": 5
        }
      }
      ```

### Mark a Notification as Read

- **PATCH** `/api/notifications/{id}/read`
- **Description**: Marks a specific notification as read.
- **Path Parameters**:
    - `id` (required, UUID): The ID of the notification to mark as read.
- **Responses**:
    - `200 OK`: Notification marked as read successfully.
      ```json
      {
        "message": "Success",
        "data": null
      }
      ```
    - `404 Not Found`: Notification with the given ID not found.

### Mark All Notifications as Read

- **PATCH** `/api/notifications/read-all`
- **Description**: Marks all notifications for the current user as read.
- **Responses**:
    - `200 OK`: All notifications marked as read successfully.
      ```json
      {
        "message": "Success",
        "data": null
      }
      ```

## DTOs

### NotificationResponse

| Field              | Type                      | Description                                              |
|--------------------|---------------------------|----------------------------------------------------------|
| `id`               | UUID                      | The ID of the notification.                              |
| `notificationType` | Enum (`NotificationType`) | The type of the notification.                            |
| `sender`           | `SenderDTO`               | The sender of the notification.                          |
| `targetId`         | UUID                      | The ID of the target entity (e.g., post, comment, user). |
| `targetType`       | Enum (`TargetType`)       | The type of the target entity.                           |
| `preview`          | String                    | A short preview of the notification content.             |
| `isRead`           | Boolean                   | Whether the notification has been read.                  |
| `createdAt`        | Instant                   | The timestamp when the notification was created.         |

### SenderDTO

| Field       | Type   | Description                     |
|-------------|--------|---------------------------------|
| `id`        | UUID   | The ID of the sender.           |
| `username`  | String | The username of the sender.     |
| `avatarUrl` | String | The URL of the sender's avatar. |

### UnreadCountResponse

| Field   | Type | Description                         |
|---------|------|-------------------------------------|
| `count` | long | The number of unread notifications. |

## Enums

### NotificationType

| Value      | Description                                |
|------------|--------------------------------------------|
| `LIKE`     | A user liked a post or comment.            |
| `COMMENT`  | A user commented on a post.                |
| `REPLY`    | A user replied to a comment.               |
| `FOLLOW`   | A user started following another user.     |
| `UNFOLLOW` | A user unfollowed another user.            |
| `MENTION`  | A user was mentioned in a post or comment. |
| `SYSTEM`   | A system-generated notification.           |
| `MESSAGE`  | A user received a new private message.     |

### TargetType

| Value     | Description                                  |
|-----------|----------------------------------------------|
| `POST`    | The target of the notification is a post.    |
| `COMMENT` | The target of the notification is a comment. |
| `USER`    | The target of the notification is a user.    |
| `CHAT`    | The target of the notification is a chat.    |
