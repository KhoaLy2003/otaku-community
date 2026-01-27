# 🗄️ Database Schema – Manga Translation Feature

This document defines the database schema for the **Manga Translation & Reader feature** , supporting multiple translations per chapter, async uploads, review & publish flow, and progress tracking.

---

## 1️⃣ Design Principles

- Support **multiple translations per chapter**
- Separate **Upload** , **Draft** , and **Published** states
- Allow **long-running uploads** with resumable / trackable progress
- Enable **soft delete** for moderation & audit
- Be scalable for image-heavy workloads

---

## 2️⃣ Core Entities Overview

```text
Manga
 └── Chapter
      └── Translation
           ├── TranslationPage
           └── UploadJob
```

---

## 3️⃣ Tables Definition

### 3.1 `manga`

> Manga metadata (synced from Jikan API)

| Column      | Type      | Constraints | Description       |
| ----------- | --------- | ----------- | ----------------- |
| id          | UUID      | PK          | Internal manga ID |
| mal_id      | INT       | UNIQUE      | MyAnimeList ID    |
| title       | VARCHAR   | NOT NULL    | Manga title       |
| title_en    | VARCHAR   | NULL        | English title     |
| cover_image | TEXT      | NULL        | Cover image URL   |
| created_at  | TIMESTAMP | NOT NULL    | Created time      |
| updated_at  | TIMESTAMP | NOT NULL    | Updated time      |

**Indexes**

- `idx_manga_mal_id`

---

### 3.2 `chapter`

| Column         | Type      | Constraints    | Description                         |
| -------------- | --------- | -------------- | ----------------------------------- |
| id             | UUID      | PK             | Chapter ID                          |
| manga_id       | UUID      | FK → manga(id) | Parent manga                        |
| chapter_number | DECIMAL   | NOT NULL       | Chapter number (supports 12.5 etc.) |
| title          | VARCHAR   | NULL           | Chapter title                       |
| created_at     | TIMESTAMP | NOT NULL       | Created time                        |

**Indexes**

- `idx_chapter_manga_id`
- `idx_chapter_number`

---

### 3.3 `translation`

> Represents a translation version of a chapter

| Column        | Type      | Constraints      | Description                          |
| ------------- | --------- | ---------------- | ------------------------------------ |
| id            | UUID      | PK               | Translation ID                       |
| chapter_id    | UUID      | FK → chapter(id) | Related chapter                      |
| translator_id | UUID      | FK → user(id)    | Owner                                |
| name          | VARCHAR   | NOT NULL         | Translation name                     |
| notes         | TEXT      | NULL             | Translator notes                     |
| status        | VARCHAR   | NOT NULL         | Draft / Published / Hidden / Deleted |
| published_at  | TIMESTAMP | NULL             | Publish time                         |
| created_at    | TIMESTAMP | NOT NULL         | Created time                         |
| updated_at    | TIMESTAMP | NOT NULL         | Updated time                         |
| deleted_at    | TIMESTAMP | NULL             | Soft delete                          |

**Indexes**

- `idx_translation_chapter_id`
- `idx_translation_translator_id`
- `idx_translation_status`

---

### 3.4 `translation_page`

> Individual manga pages

| Column         | Type      | Constraints          | Description          |
| -------------- | --------- | -------------------- | -------------------- |
| id             | UUID      | PK                   | Page ID              |
| translation_id | UUID      | FK → translation(id) | Parent translation   |
| page_index     | INT       | NOT NULL             | Page order (0-based) |
| image_url      | TEXT      | NOT NULL             | CDN image URL        |
| width          | INT       | NULL                 | Image width          |
| height         | INT       | NULL                 | Image height         |
| created_at     | TIMESTAMP | NOT NULL             | Created time         |

**Indexes**

- `idx_page_translation_id`
- `idx_page_translation_order`

---

### 3.5 `upload_job`

> Tracks long-running upload processes

| Column         | Type      | Constraints          | Description                                          |
| -------------- | --------- | -------------------- | ---------------------------------------------------- |
| id             | UUID      | PK                   | Upload job ID                                        |
| translation_id | UUID      | FK → translation(id) | Draft translation                                    |
| user_id        | UUID      | FK → user(id)        | Owner                                                |
| total_pages    | INT       | NOT NULL             | Expected page count                                  |
| uploaded_pages | INT       | NOT NULL             | Uploaded pages                                       |
| status         | VARCHAR   | NOT NULL             | Pending / Uploading / Completed / Failed / Cancelled |
| error_message  | TEXT      | NULL                 | Failure reason                                       |
| created_at     | TIMESTAMP | NOT NULL             | Created time                                         |
| updated_at     | TIMESTAMP | NOT NULL             | Updated time                                         |

**Indexes**

- `idx_upload_user_id`
- `idx_upload_status`

---

## 4️⃣ Enums

### TranslationStatus

```text
DRAFT
PUBLISHED
HIDDEN
DELETED
```

### UploadJobStatus

```text
PENDING
UPLOADING
COMPLETED
FAILED
CANCELLED
```

---

## 5️⃣ State Transitions

### Translation

```text
DRAFT → PUBLISHED → (HIDDEN | DELETED)
```

### UploadJob

```text
PENDING → UPLOADING → COMPLETED
            ↓
        FAILED / CANCELLED
```

---

## 6️⃣ Data Integrity Rules

- A **chapter can have unlimited translations**
- Only **PUBLISHED** translations are visible to readers
- UploadJob **must complete** before translation can be published
- Deleting a translation does **not delete images immediately**

---

## 7️⃣ Performance Considerations

- Images served via CDN only
- No binary image storage in database
- Pagination on chapter & translation list
- Heavy queries indexed by `chapter_id` and `status`

---

## 8️⃣ Future Extensions

- Translation rating table
- Comment per translation
- Group / scanlation team support
- Versioning for updated translations

---

**End of Database Schema Document**
