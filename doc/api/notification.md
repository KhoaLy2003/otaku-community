# Notification API Documentation

## Overview
This document describes the notification endpoints for the Japan Community Social Platform.

## Base URL
```
/api/notifications
```

## Endpoints

### 1. Get User Notifications
**Endpoint:** `GET /api/notifications`
**Authentication:** Required (JWT)
**Description:** Retrieves all notifications for the authenticated user.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `unreadOnly`: boolean (default: false) - Filter to show only unread notifications

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "like",
      "isRead": false,
      "fromUser": {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "username": "manga_fan",
        "avatar": "https://res.cloudinary.com/demo/image/upload/avatar2.jpg"
      },
      "post": {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "content": "Just finished watching Your Name!",
        "images": ["https://res.cloudinary.com/demo/image/upload/post1.jpg"]
      },
      "comment": null,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "comment",
      "isRead": false,
      "fromUser": {
        "id": "550e8400-e29b-41d4-a716-446655440012",
        "username": "anime_lover",
        "avatar": "https://res.cloudinary.com/demo/image/upload/avatar3.jpg"
      },
      "post": {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "content": "Just finished watching Your Name!",
        "images": []
      },
      "comment": {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "content": "I loved it too!"
      },
      "createdAt": "2024-01-15T11:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "type": "follow",
      "isRead": true,
      "fromUser": {
        "id": "550e8400-e29b-41d4-a716-446655440013",
        "username": "jlpt_student",
        "avatar": "https://res.cloudinary.com/demo/image/upload/avatar4.jpg"
      },
      "post": null,
      "comment": null,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "unreadCount": 12
}
```

---

### 2. Get Unread Count
**Endpoint:** `GET /api/notifications/unread-count`
**Authentication:** Required (JWT)
**Description:** Retrieves the count of unread notifications.

**Response:** `200 OK`
```json
{
  "unreadCount": 12
}
```

---

### 3. Mark Notification as Read
**Endpoint:** `PUT /api/notifications/:id/read`
**Authentication:** Required (JWT)
**Description:** Marks a specific notification as read.

**Path Parameters:**
- `id`: UUID of the notification

**Response:** `200 OK`
```json
{
  "success": true,
  "notification": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "like",
    "isRead": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Notification does not belong to the user
- `404 Not Found`: Notification does not exist

---

### 4. Mark All as Read
**Endpoint:** `PUT /api/notifications/read-all`
**Authentication:** Required (JWT)
**Description:** Marks all notifications as read for the authenticated user.

**Response:** `200 OK`
```json
{
  "success": true,
  "markedCount": 12
}
```

---

### 5. Delete Notification
**Endpoint:** `DELETE /api/notifications/:id`
**Authentication:** Required (JWT)
**Description:** Deletes a specific notification.

**Path Parameters:**
- `id`: UUID of the notification

**Response:** `204 No Content`

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Notification does not belong to the user
- `404 Not Found`: Notification does not exist

---

### 6. Clear All Notifications
**Endpoint:** `DELETE /api/notifications`
**Authentication:** Required (JWT)
**Description:** Deletes all notifications for the authenticated user.

**Response:** `200 OK`
```json
{
  "success": true,
  "deletedCount": 45
}
```

---

## Notification Types

### Like Notification
Triggered when someone likes your post.

**Structure:**
```json
{
  "type": "like",
  "fromUser": { /* user who liked */ },
  "post": { /* the post that was liked */ },
  "comment": null
}
```

**Display:** "{username} liked your post"

---

### Comment Notification
Triggered when someone comments on your post.

**Structure:**
```json
{
  "type": "comment",
  "fromUser": { /* user who commented */ },
  "post": { /* the post that was commented on */ },
  "comment": { /* the comment content */ }
}
```

**Display:** "{username} commented on your post: {comment preview}"

---

### Follow Notification
Triggered when someone follows you.

**Structure:**
```json
{
  "type": "follow",
  "fromUser": { /* user who followed */ },
  "post": null,
  "comment": null
}
```

**Display:** "{username} started following you"

---

## Real-time Updates (Future Enhancement)

In future versions, notifications will be delivered in real-time using WebSockets or Server-Sent Events (SSE).

**Planned Implementation:**
- WebSocket connection on user login
- Push notifications for new notifications
- Live unread count updates
- Toast/banner notifications in UI

---

## Notes
- Notifications are sorted by creation date (newest first)
- Deleted posts/comments still show in notifications but with placeholder text
- Notifications older than 30 days are automatically archived (future enhancement)
- Users cannot disable specific notification types in MVP (future enhancement)
- Email notifications are not supported in MVP (future enhancement)
- Push notifications for mobile are not supported in MVP (future enhancement)
- Notification preferences/settings not available in MVP (future enhancement)
