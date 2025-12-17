# Database Schema Overview

This document describes the conceptual database structure.

## Key Entities
- 

# 📚 **DATABASE SCHEMA (PostgreSQL)**

---

# 🧩 **1. users**

Stores user accounts and profile information.

### **Table: users**

| Column        | Type                 | Description                                     |
| ------------- | -------------------- | ----------------------------------------------- |
| id            | UUID (PK)            | Primary key                                     |
| email         | VARCHAR(255), unique | User login email                                |
| username      | VARCHAR(50), unique  | Display username                                |
| password_hash | TEXT                 | Hashed password                                 |
| avatar_url    | TEXT                 | Cloudinary URL                                  |
| bio           | TEXT                 | User biography                                  |
| interests     | TEXT[]               | List of interests (anime, manga, JLPT, culture) |
| created_at    | TIMESTAMPTZ          | Timestamp                                       |
| updated_at    | TIMESTAMPTZ          | Timestamp                                       |
| deleted_at    | TIMESTAMPTZ NULL     | Soft-deleted time                               |

### **Indexes**

* `idx_users_email`
* `idx_users_username`
* `idx_users_deleted_at_null`

---

# 🧩 **2. topics**

All categories like Anime, JLPT, Japan Travel, Culture...

### **Table: topics**

| Column      | Type                 | Description       |
| ----------- | -------------------- | ----------------- |
| id          | UUID (PK)            | Topic identifier  |
| name        | VARCHAR(100), unique | Topic name        |
| slug        | VARCHAR(100), unique | URL-friendly name |
| description | TEXT                 | Topic description |
| created_at  | TIMESTAMPTZ          | Timestamp         |
| updated_at  | TIMESTAMPTZ          | Timestamp         |
| deleted_at  | TIMESTAMPTZ NULL     | Soft delete       |

### **Indexes**

* `idx_topics_slug`
* `idx_topics_name`

---

# 🧩 **3. posts**

Core content posted by users.

### **Table: posts**

| Column     | Type                 | Description       |
| ---------- | -------------------- | ----------------- |
| id         | UUID (PK)            | Post ID           |
| user_id    | UUID (FK → users.id) | Owner of the post |
| content    | TEXT                 | Post text         |
| image_url  | TEXT NULL            | Optional image    |
| created_at | TIMESTAMPTZ          | Timestamp         |
| updated_at | TIMESTAMPTZ          | Timestamp         |
| deleted_at | TIMESTAMPTZ NULL     | Soft delete       |

### **Indexes**

* `idx_posts_user_id`
* `idx_posts_created_at`
* `idx_posts_deleted_at_null`
* `idx_posts_content_fts` (full-text search)

Full-text search example:

```sql
GENERATOR: to_tsvector('simple', content)
```

---

# 🧩 **4. post_topics (Many-to-Many)**

Each post can have multiple topics.

### **Table: post_topics**

| Column     | Type                  | Description     |
| ---------- | --------------------- | --------------- |
| id         | UUID (PK)             | Relation ID     |
| post_id    | UUID (FK → posts.id)  | Post reference  |
| topic_id   | UUID (FK → topics.id) | Topic reference |
| created_at | TIMESTAMPTZ           | Timestamp       |

### **Indexes**

* `idx_post_topics_post_id`
* `idx_post_topics_topic_id`
* Unique constraint: `(post_id, topic_id)`

---

# 🧩 **5. comments**

Threaded comments (MVP uses single-level).

### **Table: comments**

| Column     | Type                 | Description  |
| ---------- | -------------------- | ------------ |
| id         | UUID (PK)            | Comment ID   |
| post_id    | UUID (FK → posts.id) | Related post |
| user_id    | UUID (FK → users.id) | Writer       |
| content    | TEXT                 | Comment text |
| created_at | TIMESTAMPTZ          | Timestamp    |
| updated_at | TIMESTAMPTZ          | Timestamp    |
| deleted_at | TIMESTAMPTZ NULL     | Soft delete  |

### **Indexes**

* `idx_comments_post_id`
* `idx_comments_user_id`
* `idx_comments_deleted_at_null`

---

# 🧩 **6. likes**

Users can like posts.

### **Table: likes**

| Column     | Type                 | Description |
| ---------- | -------------------- | ----------- |
| id         | UUID (PK)            | Like ID     |
| post_id    | UUID (FK → posts.id) | Liked post  |
| user_id    | UUID (FK → users.id) | Who liked   |
| created_at | TIMESTAMPTZ          | Timestamp   |

### **Indexes**

* Unique constraint: `(post_id, user_id)`
* `idx_likes_post_id`
* `idx_likes_user_id`

---

# 🧩 **7. follows**

Following system (user follows another user).

### **Table: follows**

| Column       | Type                 | Description         |
| ------------ | -------------------- | ------------------- |
| id           | UUID (PK)            | Follow relationship |
| follower_id  | UUID (FK → users.id) | Who follows         |
| following_id | UUID (FK → users.id) | Who is followed     |
| created_at   | TIMESTAMPTZ          | Timestamp           |

### **Indexes**

* Unique constraint: `(follower_id, following_id)`
* `idx_follows_follower`
* `idx_follows_following`

---

# 🧩 **8. notifications**

Likes, comments, follows create notifications.

### **Table: notifications**

| Column       | Type                         | Description                   |
| ------------ | ---------------------------- | ----------------------------- |
| id           | UUID (PK)                    | Notification ID               |
| user_id      | UUID (FK → users.id)         | Notification target           |
| type         | VARCHAR(50)                  | ("like", "comment", "follow") |
| from_user_id | UUID (FK → users.id)         | Who triggered it              |
| post_id      | UUID NULL (FK → posts.id)    | Optional                      |
| comment_id   | UUID NULL (FK → comments.id) | Optional                      |
| is_read      | BOOLEAN (default false)      | Read status                   |
| created_at   | TIMESTAMPTZ                  | Timestamp                     |

### **Indexes**

* `idx_notifications_user_id`
* `idx_notifications_is_read`

---

# 🧩 **9. reports**

Users can report inappropriate posts.

### **Table: reports**

| Column     | Type                 | Description                        |
| ---------- | -------------------- | ---------------------------------- |
| id         | UUID (PK)            | Report ID                          |
| post_id    | UUID (FK → posts.id) | Reported post                      |
| user_id    | UUID (FK → users.id) | Reporter                           |
| reason     | TEXT                 | Why they report it                 |
| status     | VARCHAR(20)          | "pending", "reviewed", "dismissed" |
| created_at | TIMESTAMPTZ          | Timestamp                          |
| updated_at | TIMESTAMPTZ          | Timestamp                          |

### **Indexes**

* `idx_reports_post_id`
* `idx_reports_user_id`
* `idx_reports_status`

---

# 🧩 **10. admin_actions**

Audit log for moderation.

### **Table: admin_actions**

| Column        | Type                 | Description                     |
| ------------- | -------------------- | ------------------------------- |
| id            | UUID (PK)            | Action ID                       |
| admin_user_id | UUID (FK → users.id) | Admin                           |
| post_id       | UUID NULL            | Affected post                   |
| user_id       | UUID NULL            | Affected user                   |
| action        | VARCHAR(50)          | e.g., "delete_post", "ban_user" |
| note          | TEXT                 | Optional details                |
| created_at    | TIMESTAMPTZ          | Timestamp                       |

---

# 🧩 **BONUS: DB ENUM TYPES**

```sql
CREATE TYPE notification_type AS ENUM ('like', 'comment', 'follow');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'dismissed');
```

---

# 🧱 **RELATIONSHIP DIAGRAM (ERD Overview)**

```
users ───< posts ───< comments
  │          │            │
  │          └───< likes  │
  │
  └───< follows >─── users

topics ───< post_topics >─── posts

posts ───< reports
users ───< reports

notifications: links users + posts + comments
```
