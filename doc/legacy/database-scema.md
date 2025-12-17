Below is a **complete, production-ready, strongly-typed database schema** for your MVP Japan Community Platform.

It includes:

✔ All MVP features
✔ Full table descriptions
✔ Data types (PostgreSQL)
✔ Primary/Foreign keys
✔ Indexes
✔ Soft delete (`deleted_at`)
✔ Audit timestamps (`created_at`, `updated_at`)
✔ Many-to-many relations (topics, followers)

Designed for scalability, clean architecture, and extensibility.

---

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

# 🧩 **6. post_media**

Media attachments for posts (images, videos, GIFs).

### **Table: post_media**

| Column        | Type                 | Description                    |
| ------------- | -------------------- | ------------------------------ |
| id            | UUID (PK)            | Media ID                       |
| post_id       | UUID (FK → posts.id) | Related post                   |
| media_type    | VARCHAR(20)          | ENUM('IMAGE','VIDEO','GIF')    |
| media_url     | TEXT                 | URL to media file              |
| thumbnail_url | TEXT NULL            | Thumbnail URL for videos       |
| width         | INT NULL             | Media width in pixels          |
| height        | INT NULL             | Media height in pixels         |
| duration_sec  | INT NULL             | Duration for videos (seconds)  |
| order_index   | INT                  | Display order within post      |
| created_at    | TIMESTAMPTZ          | Timestamp                      |

### **Indexes**

* `idx_post_media_post_id`
* `idx_post_media_order`

---

# 🧩 **7. user_feed**

Personalized feed for each user with scoring algorithm.

### **Table: user_feed**

| Column     | Type                 | Description                                    |
| ---------- | -------------------- | ---------------------------------------------- |
| user_id    | UUID (FK → users.id) | Feed owner                                     |
| post_id    | UUID (FK → posts.id) | Post in feed                                   |
| author_id  | UUID (FK → users.id) | Post author                                    |
| score      | FLOAT                | Relevance score for ranking                    |
| reason     | VARCHAR(20)          | ENUM('FRIEND','FOLLOW','GROUP','PAGE')        |
| created_at | TIMESTAMPTZ          | When added to feed                             |

### **Primary Key**
* `(user_id, post_id)`

### **Indexes**

* `idx_user_feed_user_score`
* `idx_user_feed_author`
* `idx_user_feed_created_at`

---

# 🧩 **8. post_stats**

Aggregated statistics for posts.

### **Table: post_stats**

| Column         | Type                 | Description           |
| -------------- | -------------------- | --------------------- |
| post_id        | UUID (PK)            | Post reference        |
| like_count     | INT DEFAULT 0        | Number of likes       |
| comment_count  | INT DEFAULT 0        | Number of comments    |
| share_count    | INT DEFAULT 0        | Number of shares      |
| reaction_count | INT DEFAULT 0        | Total reactions       |
| view_count     | BIGINT DEFAULT 0     | Number of views       |
| updated_at     | TIMESTAMPTZ          | Last stats update     |

### **Indexes**

* `idx_post_stats_like_count`
* `idx_post_stats_view_count`

---

# 🧩 **9. reactions**

User reactions to posts and comments (likes, unlikes, etc.).

### **Table: reactions**

| Column        | Type                 | Description                        |
| ------------- | -------------------- | ---------------------------------- |
| id            | UUID (PK)            | Reaction ID                        |
| user_id       | UUID (FK → users.id) | User who reacted                   |
| target_type   | VARCHAR(20)          | ENUM('POST','COMMENT')             |
| target_id     | UUID                 | Post or Comment ID                 |
| reaction_type | VARCHAR(20)          | ENUM('LIKE','UNLIKE')              |
| created_at    | TIMESTAMPTZ          | Timestamp                          |

### **Indexes**

* Unique constraint: `(user_id, target_type, target_id)`
* `idx_reactions_target`
* `idx_reactions_user_id`
* `idx_reactions_type`

---

# 🧩 **10. follows**

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

# 🧩 **11. notifications**

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

# 🧩 **12. reports**

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

# 🧩 **13. admin_actions**

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
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'GIF');
CREATE TYPE feed_reason AS ENUM ('FRIEND', 'FOLLOW', 'GROUP', 'PAGE');
CREATE TYPE target_type AS ENUM ('POST', 'COMMENT');
CREATE TYPE reaction_type AS ENUM ('LIKE', 'UNLIKE');
```

---

# 🧱 **RELATIONSHIP DIAGRAM (ERD Overview)**

```
users ───< posts ───< comments
  │          │            │
  │          ├───< post_media
  │          ├───< post_stats (1:1)
  │          └───< reactions
  │
  └───< follows >─── users
  └───< user_feed >─── posts

topics ───< post_topics >─── posts

posts ───< reports
users ───< reports

reactions: links users + posts/comments
notifications: links users + posts + comments
user_feed: personalized content delivery
```

---

# 📝 **RECENT SCHEMA UPDATES**

## **Version 2.0 Changes**

### **Removed:**
- `likes_count` column from `posts` table
- `comments_count` column from `posts` table  
- `media_urls` column from `posts` table
- `likes` table (replaced by `reactions`)

### **Added:**
- `post_media` table for handling multiple media attachments per post
- `user_feed` table for personalized content delivery with scoring
- `post_stats` table for aggregated post statistics (likes, comments, views, etc.)
- `reactions` table for flexible user interactions (likes, unlikes on posts/comments)

### **Benefits:**
- **Scalability**: Separated media handling and statistics for better performance
- **Flexibility**: Reactions system supports multiple interaction types
- **Personalization**: User feed system enables algorithmic content delivery
- **Analytics**: Comprehensive statistics tracking including views and shares
- **Performance**: Denormalized stats reduce query complexity for common operations
