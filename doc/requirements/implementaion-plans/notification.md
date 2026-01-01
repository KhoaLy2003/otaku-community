# Implementation Plan - Notification Feature

This plan outlines the technical approach to implement the Notification System (US-NOTIF-001) using Spring Boot WebSockets and React.

## User Review Required

> [!IMPORTANT] > **WebSocket Dependency:** I will add `spring-boot-starter-websocket` to the backend `pom.xml` and `@stomp/stompjs` to the frontend `package.json`.
>
> **Event Handling:** To decouple notification logic from core features (Posting, Commenting), I propose using **Spring Application Events**. When a user comments/likes, we publish a `NotificationEvent`, and a listener handles the DB write and WebSocket push.

## Proposed Changes

### Backend (Spring Boot)

#### Dependencies

- Add `spring-boot-starter-websocket` to `pom.xml`

#### [NEW] Feature Component: Notification

I will create a new feature package `com.otaku.community.feature.notification`.

1.  **Entity: `Notification`** (`entity/Notification.java`)

    - Fields: `id`, `recipientId`, `senderId`, `notificationType` (ENUM), `targetId`, `targetType` (ENUM), `preview`, `isRead`, `createdAt`.
    - Indexes as specified in requirements.

2.  **Repository: `NotificationRepository`** (`repository/NotificationRepository.java`)

    - Methods: `findAllByRecipientId`, `countByRecipientIdAndIsReadFalse`.

3.  **DTOs** (`dto/*.java`)

    - `NotificationResponse`: API response format.
    - `UnreadCountResponse`.

4.  **Configuration: `WebSocketConfig`** (`config/WebSocketConfig.java`)

    - Enable STOMP.
    - Endpoint: `/ws-registry` (with SockJS fallback if needed, or just standard WS).
    - Broker: `/topic` (pub), `/queue` (user specific).

5.  **Service: `NotificationService`** (`service/NotificationService.java`)

    - `createNotification(event)`: Saves to DB, sends via `SimpMessagingTemplate`.
    - `getNotifications(userId, page)`: Returns paginated list.
    - `markAsRead(id)` / `markAllAsRead(userId)`.

6.  **Controller: `NotificationController`** (`controller/NotificationController.java`)

    - `GET /api/notifications`
    - `GET /api/notifications/unread-count`
    - `PATCH /api/notifications/{id}/read`
    - `PATCH /api/notifications/read-all`

7.  **Event Listeners** (`listener/NotificationEventListener.java`)
    - Listens for core events (e.g., `PostLikedEvent`, `CommentCreatedEvent`) and calls `NotificationService`.
    - _Note: I will need to emit these events from `InteractionService` and `PostService`._

### Frontend (React)

#### Dependencies

- Install `@stomp/stompjs` for WebSocket communication.

#### [NEW] Stores & Hooks

1.  **`store/useNotificationStore.ts`** (Zustand)

    - State: `notifications: Notification[]`, `unreadCount: number`, `isConnected: boolean`.
    - Actions: `addNotification`, `setNotifications`, `markRead`, `clearAll`.

2.  **`hooks/useWebSocket.ts`**
    - Manages STOMP client connection, detailed in `doc/requirements/user-stories/notification.md`.
    - Subscribes to `/user/queue/notifications`.
    - Updates store on incoming message.

#### [NEW] Components

1.  **`components/notification/NotificationItem.tsx`**

    - Renders individual notification with Avatar, Text, and Timestamp.
    - Handles click (navigation + mark read).

2.  **`components/notification/NotificationList.tsx`**

    - Dropdown or List view.
    - Infinite scroll trigger (optional for MVP, or just standard pagination "Load More").

3.  **`components/notification/NotificationBadge.tsx`**
    - Icon with Red Dot/Counter.
    - Placed in `Header`.

#### Integration

- Update `Header.tsx` (or `Layout`) to include `NotificationBadge`.
- Initialize WebSocket connection in a high-level provider or effect (e.g., in `App.tsx` or `AuthWrapper` considering it requires authentication).

## Verification Plan

### Manual Verification

1.  **Trigger Flow**:
    - Login as User A and User B (incognito).
    - User A likes User B's post.
    - **Expected**: User B sees "New Notification" badge increment immediately (WebSocket).
    - **Expected**: User B opens list, sees "User A liked your post".
2.  **Persistence**:
    - Refresh page.
    - **Expected**: Notification still present, unread count correct (API fetch).
3.  **Read Status**:
    - Click notification.
    - **Expected**: Badge decrement, item marks as read (greyed out).
