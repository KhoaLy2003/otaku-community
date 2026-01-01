# 📄 Feature Specification: Like / Unlike System

## 1️⃣ Feature Overview

- **Feature Name**: Like / Unlike System
- **Description**:
  Allows users to like or unlike posts to express interest or appreciation. This interaction updates like counts in real time and helps improve engagement signals for feeds and notifications.
- **Status**: Draft

---

## 2️⃣ User Stories

| ID              | As a            | I want to                        | So that                                    |
| :-------------- | :-------------- | :------------------------------- | :----------------------------------------- |
| **US-LIKE-001** | Registered User | Like a post                      | I can express my interest in the content   |
| **US-LIKE-002** | Registered User | Unlike a post I previously liked | I can undo my reaction if I change my mind |
| **US-LIKE-003** | Post Owner      | See who liked my post            | I can understand audience engagement       |
| **US-LIKE-004** | Registered User | See total like count on a post   | I can gauge how popular the post is        |

> _Example: As a Registered User, I want to like a post so that I can express my interest in the content._

---

## 3️⃣ Acceptance Criteria (AC)

### 3.1. User Interface & Layout

- Each post displays a **Like button (icon)** and **like count**
- Like button has two states:

  - **Unliked**: default state
  - **Liked**: highlighted state (e.g., filled icon)

- Clicking the Like button:

  - Immediately updates the UI (optimistic update)
  - Toggles between Like ↔ Unlike

- Like count updates instantly after interaction
- Hovering or clicking the like count may show a list of users who liked the post (optional)

---

### 3.2. Business Logic & Validation

- A user can **like a post only once**
- If a user has already liked a post:

  - Clicking the button again triggers **Unlike**

- Like and Unlike actions are **idempotent**
- Guests (not logged in):

  - Cannot like or unlike posts
  - Are prompted to log in

- When a post is deleted:

  - All related likes are removed

- A user **cannot like their own post** (optional business rule)

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

**Endpoints**

- `POST /api/v1/posts/{postId}/like`
  → Like a post

- `DELETE /api/v1/posts/{postId}/like`
  → Unlike a post

- `GET /api/v1/posts/{postId}/likes`
  → Get list of users who liked the post

**Response Model (Example)**

```json
{
  "postId": "uuid",
  "liked": true,
  "likeCount": 128
}
```

---

### 4.2. Database Schema

**Table: post_likes**

| Column Name | Type      | Constraints              |
| ----------- | --------- | ------------------------ |
| id          | UUID      | Primary Key              |
| post_id     | UUID      | FK → posts(id), NOT NULL |
| user_id     | UUID      | FK → users(id), NOT NULL |
| created_at  | TIMESTAMP | NOT NULL                 |

**Constraints & Indexes**

- Unique constraint: `(post_id, user_id)`
- Indexes:

  - `idx_post_likes_post_id`
  - `idx_post_likes_user_id`

---

### 4.3. Real-time Delivery (If Applicable)

- When a post is liked:

  - Send real-time event to post owner via WebSocket

- Event payload example:

```json
{
  "type": "POST_LIKED",
  "postId": "uuid",
  "actorId": "uuid",
  "createdAt": "timestamp"
}
```

---

## 5️⃣ Performance & Security

- Like/Unlike API response time ≤ **300ms**
- Use database unique constraints to prevent duplicate likes
- Require valid JWT for all like/unlike endpoints
- Rate-limit interactions to prevent spam (e.g., max X likes per minute)
- Frontend should debounce like/unlike actions (e.g., 300–500ms) to reduce unnecessary API calls.

---

## 6️⃣ Edge Cases & Error Handling

- **Post not found** → `404 Not Found`
- **Already liked** → return success with current state (idempotent)
- **Not liked yet but unlike requested** → no-op, return success
- **Unauthorized request** → `401 Unauthorized`
- **User blocked by post owner** → `403 Forbidden`

---
