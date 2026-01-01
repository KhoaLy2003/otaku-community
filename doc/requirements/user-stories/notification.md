# 📄 Feature Specification: Notification System

---

## 1️⃣ User Stories

### **US-NOTIF-001: Receive and View Notifications**

**As a:** Registered User
**I want to:** See a list of activities (likes, comments, follows, mentions) related to my account
**So that:** I can stay engaged with the community and respond to interactions.

---

## 2️⃣ Acceptance Criteria (AC)

### 2.1 Notification Triggering

Notifications are created when the following events occur:

| Event Type | Trigger Condition                                            |
| ---------- | ------------------------------------------------------------ |
| `LIKE`     | Someone likes your post or comment                           |
| `COMMENT`  | Someone comments on your post                                |
| `REPLY`    | Someone replies to your comment                              |
| `FOLLOW`   | Someone starts following you                                 |
| `MENTION`  | Someone mentions you using `@username`                       |
| `SYSTEM`   | System-generated notifications (announcement, warning, etc.) |

**Rules:**

- ❌ Do **NOT** create notification if `sender_id == recipient_id`
- Each event creates **one notification for one recipient**

---

### 2.2 Notification List UI

- Displayed via:

  - Header dropdown **OR**
  - Dedicated Notification Center page

- Each notification item shows:

  - Sender Avatar
  - Message (e.g. _“X commented on your post”_)
  - Preview (short snippet of comment or post title)
  - Timestamp

- Unread notifications:

  - Distinct background color
  - Optional unread dot indicator

---

### 2.3 Real-time Badge

- Notification icon shows:

  - Red dot OR unread count

- Badge updates:

  - Immediately when a new notification arrives via WebSocket
  - On initial app load via unread-count API

---

### 2.4 Mark as Read

- Clicking a notification:

  - Marks it as read
  - Navigates to related content

- “Mark all as read” action:

  - Marks all unread notifications for the current user

- Backend must be **idempotent** (safe to call multiple times)

---

### 2.5 Navigation Behavior

| Notification Type | Navigation Target   |
| ----------------- | ------------------- |
| LIKE              | Post / Comment      |
| COMMENT           | Post                |
| REPLY             | Comment             |
| FOLLOW            | Sender’s profile    |
| MENTION           | Post or Comment     |
| SYSTEM            | System page or none |

---

## 3️⃣ Notification Types

```ts
enum NotificationType {
  LIKE,
  COMMENT,
  REPLY,
  FOLLOW,
  MENTION,
  SYSTEM,
}
```

---

## 4️⃣ Technical API Specification

### 4.1 Endpoints

```http
GET    /api/notifications?page={n}&size=20
GET    /api/notifications/unread-count
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/read-all
```

> ⚠️ Cursor-based pagination may be introduced later for scalability.

---

### 4.2 Response Model

```json
{
  "id": "uuid",
  "notificationType": "LIKE | COMMENT | FOLLOW | REPLY | MENTION | SYSTEM",
  "sender": {
    "id": "uuid",
    "username": "string",
    "avatarUrl": "string"
  },
  "targetId": "uuid",
  "targetType": "POST | COMMENT | USER",
  "preview": "string",
  "isRead": false,
  "createdAt": "ISO-8601 Timestamp"
}
```

---

### 4.3 Unread Count Response

```json
{
  "count": 5
}
```

---

## 5️⃣ WebSocket / STOMP Architecture

### 5.1 Configuration

- **Handshake Endpoint:** `/ws-registry`
- **Application Prefix:** `/app`
- **Message Broker:**

  - `/topic` – public events
  - `/user/queue` – private user messages (notifications, chats)

---

### 5.2 Unified Realtime Message Envelope

```json
{
  "eventType": "NOTIFICATION | CHAT_MESSAGE | SYSTEM_ALERT",
  "payload": {},
  "timestamp": "ISO-8601"
}
```

---

### 5.3 Notification Realtime Payload

```json
{
  "eventType": "NOTIFICATION",
  "payload": {
    "id": "uuid",
    "notificationType": "COMMENT",
    "sender": {
      "id": "uuid",
      "username": "string",
      "avatarUrl": "string"
    },
    "targetId": "uuid",
    "targetType": "POST",
    "preview": "Nice post!",
    "createdAt": "ISO-8601"
  },
  "timestamp": "ISO-8601"
}
```

---

### 5.4 Realtime Delivery Rules

| Event     | WebSocket Push |
| --------- | -------------- |
| Like      | ✅             |
| Comment   | ✅             |
| Reply     | ✅             |
| Follow    | ✅             |
| Mention   | ✅             |
| Mark read | ❌             |

---

## 6️⃣ Database Schema

### Table: `notifications`

| Column              | Type                 | Notes                       |
| ------------------- | -------------------- | --------------------------- |
| `id`                | UUID (PK)            |                             |
| `recipient_id`      | UUID (FK → users.id) | Indexed                     |
| `sender_id`         | UUID (FK → users.id) |                             |
| `notification_type` | VARCHAR              | LIKE, COMMENT, FOLLOW, etc. |
| `target_id`         | UUID                 | Post / Comment / User       |
| `target_type`       | VARCHAR              | POST, COMMENT, USER         |
| `preview`           | VARCHAR(255)         | Cached preview              |
| `is_read`           | BOOLEAN              | Default false, indexed      |
| `created_at`        | TIMESTAMPTZ          |                             |

---

### Recommended Indexes

```sql
CREATE INDEX idx_notifications_recipient_created
ON notifications (recipient_id, created_at DESC);

CREATE INDEX idx_notifications_unread
ON notifications (recipient_id)
WHERE is_read = false;
```

---

## 7️⃣ Performance & Scalability Notes

- Notification system uses **Fan-out on Write**

  - One event → one notification row

- No aggregation logic required
- Safe for current and mid-scale traffic
- Cursor-based pagination can be added later if needed
