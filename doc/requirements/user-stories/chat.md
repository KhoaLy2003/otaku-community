# 📄 Feature Specification: 1:1 Chat System (MVP)

## 1️⃣ Feature Overview

- **Feature Name**: One-to-One Chat System
- **Description**:  
  Enables registered users to communicate with each other through real-time one-to-one messaging. The chat system uses WebSocket technology (already adopted for notifications) to deliver messages instantly, supporting basic messaging features required for an MVP release.
- **Status**: Draft

---

## 2️⃣ User Stories

| ID              | As a            | I want to                                | So that                                              |
|-----------------|-----------------|------------------------------------------|------------------------------------------------------|
| **US-CHAT-001** | Registered User | Start a private chat with another user   | I can communicate directly with them                |
| **US-CHAT-002** | Registered User | Send a text message in a chat             | I can share information in real time                |
| **US-CHAT-003** | Registered User | Receive messages in real time             | I can have smooth conversations                     |
| **US-CHAT-004** | Registered User | View my chat conversation history         | I can review past messages                          |
| **US-CHAT-005** | Registered User | See message delivery/read status          | I know whether my message was seen                  |
| **US-CHAT-006** | Registered User | Delete a message I sent                   | I can remove messages I no longer want to keep      |

---

## 3️⃣ Acceptance Criteria (AC)

### 3.1. User Interface & Layout

- Chat UI consists of:
  - Conversation list (1:1 chats only)
  - Message window with message bubbles
  - Text input box and send button
- Messages are visually differentiated:
  - Sent vs received messages
- Messages are displayed in chronological order
- Unread messages are highlighted in the conversation list
- Basic indicators:
  - Sent
  - Delivered
  - Read
- Deleted messages display a placeholder (e.g., “This message was deleted”)

---

### 3.2. Business Logic & Validation

- Only **registered users** can access chat
- Chats are strictly **one-to-one** (no group chats)
- A chat conversation is uniquely identified by:
  - `(userA, userB)` pair
- Users can only send messages to users they are allowed to interact with
  - Blocked users cannot send or receive messages
- Empty messages cannot be sent
- Messages are persisted once successfully delivered
- Read status updates when the recipient opens the conversation
- Message deletion rules:
  - Users can only delete messages they sent
  - Deletion is **soft delete** (message content is hidden, not removed from DB)
  - Deleted messages are not delivered again to offline users

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

**REST APIs**

- `GET /api/v1/chats`
  - Retrieve list of 1:1 conversations

- `GET /api/v1/chats/{chatId}/messages`
  - Retrieve message history using **cursor-based pagination**
  - Query params:
    - `cursor` (optional): reference message ID or timestamp
    - `limit` (optional): number of messages to load

- `DELETE /api/v1/chats/{chatId}/messages/{messageId}`
  - Soft delete a message sent by the authenticated user

**WebSocket Events**

- `CHAT_MESSAGE_SEND`
- `CHAT_MESSAGE_RECEIVE`
- `CHAT_MESSAGE_READ`
- `CHAT_MESSAGE_DELETED`

**Message Payload (Example)**

```json
{
  "chatId": "uuid",
  "messageId": "uuid",
  "senderId": "uuid",
  "receiverId": "uuid",
  "content": "Hello!",
  "status": "DELIVERED",
  "createdAt": "timestamp"
}
````

---

### 4.2. Database Schema

**Table: chats**

| Column Name | Type      | Description        |
| ----------- | --------- | ------------------ |
| id          | UUID      | Primary key        |
| user_a_id   | UUID      | Participant A      |
| user_b_id   | UUID      | Participant B      |
| created_at  | TIMESTAMP | Chat creation time |

**Table: messages**

| Column Name | Type      | Description                   |
| ----------- | --------- | ----------------------------- |
| id          | UUID      | Primary key                   |
| chat_id     | UUID      | FK → chats(id)                |
| sender_id   | UUID      | Message sender                |
| content     | TEXT      | Message body                  |
| status      | ENUM      | SENT / DELIVERED / READ       |
| is_deleted  | BOOLEAN   | Soft delete flag              |
| deleted_at  | TIMESTAMP | Deletion timestamp (nullable) |
| created_at  | TIMESTAMP | Message timestamp             |

**Indexes**

* `idx_chats_user_pair`
* `idx_messages_chat_id_created_at`
* `idx_messages_chat_id_cursor`

---

### 4.3. Real-time Delivery

* WebSocket is used for:

  * Sending messages
  * Receiving messages
  * Updating message read status
  * Broadcasting message deletion events
* Existing notification WebSocket infrastructure is reused
* Messages are routed to users based on authenticated WebSocket sessions

---

## 5️⃣ Performance & Security

* Message delivery latency ≤ **300ms**
* Cursor-based pagination is used to ensure efficient loading for long conversations
* All WebSocket connections require authentication
* Users can only access chats they are participants of
* Rate limiting applied to message sending to prevent spam
* Messages are validated and sanitized before persistence

---

## 6️⃣ Edge Cases & Error Handling

* User is offline:

  * Message is stored and delivered when user reconnects
* WebSocket connection lost:

  * Client attempts reconnection
* Unauthorized chat access:

  * Connection is rejected
* Deleting another user’s message:

  * Return `403 Forbidden`
* Sending message to blocked user:

  * Action is denied with appropriate error
* Empty conversation:

  * Show empty state UI

---

### 📌 MVP Scope Notes

* ❌ Group chat is not supported
* ❌ Media/file messages are not supported
* ❌ Message reactions, replies, and forwarding are excluded
* ✅ Cursor-based pagination for scalability
* ✅ Soft delete for message removal

---