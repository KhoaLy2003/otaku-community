# 🔌 API Design – Manga Translation Feature

This document defines RESTful APIs for the **Manga Translation & Reader feature** , covering manga selection (Jikan-based), async upload with progress tracking, review & publish flow, reading, and deletion.

---

## 1️⃣ API Design Principles

- RESTful, resource-oriented URLs
- Clear separation between **Upload** , **Draft** , and **Published** states
- Async upload with progress tracking
- Idempotent and secure operations
- JSON responses with consistent envelope

### Common Response Envelope

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## 2️⃣ Manga & Chapter APIs (Jikan-integrated)

### 2.1 Search Manga (Jikan Integration)

---

## 3️⃣ Translation Upload (Async)

### 3.1 Create Upload Job (Initialize Translation Draft)

**POST** `/api/v1/translations/upload-jobs`

**Request Body**

```json
{
  "mangaId": "uuid",
  "chapterId": "uuid",
  "translationName": "Fan Translation v1",
  "notes": "Translator notes"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "uploadJobId": "uuid",
    "translationId": "uuid",
    "status": "PENDING"
  }
}
```

---

### 3.2 Upload Translation Page (Chunk-based)

**POST** `/api/v1/upload-jobs/{uploadJobId}/pages`

**Headers**

```
Content-Type: multipart/form-data
```

**Form Data**

| Field     | Type   | Required |
| --------- | ------ | -------- |
| file      | image  | ✅       |
| pageIndex | number | ✅       |

**Response**

```json
{
  "success": true,
  "data": {
    "uploadedPages": 5,
    "totalPages": 20,
    "status": "UPLOADING"
  }
}
```

---

### 3.3 Get Upload Job Status

**GET** `/api/v1/upload-jobs/{uploadJobId}`

**Response**

```json
{
  "success": true,
  "data": {
    "status": "UPLOADING",
    "uploadedPages": 8,
    "totalPages": 20
  }
}
```

---

### 3.4 Cancel Upload Job

**POST** `/api/v1/upload-jobs/{uploadJobId}/cancel`

**Response**

```json
{
  "success": true,
  "data": {
    "status": "CANCELLED"
  }
}
```

---

## 4️⃣ Review & Publish Flow

### 4.1 Get Draft Translation (Preview)

**GET** `/api/v1/translations/{translationId}/draft`

**Response**

```json
{
  "success": true,
  "data": {
    "translationId": "uuid",
    "status": "DRAFT",
    "pages": [
      {
        "pageIndex": 0,
        "imageUrl": "cdn-url"
      }
    ]
  }
}
```

---

### 4.2 Publish Translation

**POST** `/api/v1/translations/{translationId}/publish`

**Response**

```json
{
  "success": true,
  "data": {
    "status": "PUBLISHED",
    "publishedAt": "2026-01-17T12:00:00Z"
  }
}
```

---

## 5️⃣ Reading APIs

### 5.1 Get Translations of Chapter

**GET** `/api/v1/chapters/{chapterId}/translations`

**Response**

```json
{
  "success": true,
  "data": [
    {
      "translationId": "uuid",
      "name": "Group A",
      "translator": "username",
      "publishedAt": "date",
      "stats": {
        "views": 1250,
        "likes": 42
      }
    }
  ]
}
```

---

### 5.2 Read Translation Pages

**GET** `/api/v1/translations/{translationId}/pages`

**Response**

```json
{
  "success": true,
  "data": {
    "pages": [
      {
        "pageIndex": 0,
        "imageUrl": "cdn-url",
        "width": 800,
        "height": 1200
      }
    ]
  }
}
```

---

## 6️⃣ Update, Reorder & Delete Translation

### 6.1 Update Translation Metadata

**PUT** `/api/v1/translations/{translationId}`

**Request Body**

```json
{
  "name": "Updated name",
  "notes": "Updated notes"
}
```

---

### 6.2 Reorder Translation Pages (Draft Only)

> Allows translators to change page order **after upload but before publish**.

**PUT** `/api/v1/translations/{translationId}/pages/reorder`

**Rules**

- Translation status must be `DRAFT`
- Only the owner (translator) can reorder pages
- Reordering does not re-upload images

**Request Body**

```json
{
  "pages": [
    { "pageId": "uuid-1", "pageIndex": 0 },
    { "pageId": "uuid-2", "pageIndex": 1 },
    { "pageId": "uuid-3", "pageIndex": 2 }
  ]
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "translationId": "uuid",
    "status": "DRAFT"
  }
}
```

---

### 6.3 Delete Translation

**DELETE** `/api/v1/translations/{translationId}`

**Rules**

- Only the owner or moderator can delete
- Deletion is soft-delete

**Response**

```json
{
  "success": true
}
```

---

## 7️⃣ Social & Engagement APIs

### 7.1 Register Translation View

**POST** `/api/v1/translations/{translationId}/views`

> Registered when the reader is opened. Session-based deduplication is handled on the backend.

**Response**

```json
{
  "success": true,
  "data": {
    "totalViews": 1250
  }
}
```

---

### 7.2 Post/Remove Reaction (Upvote)

**POST** `/api/v1/translations/{translationId}/reactions`

**Request Body**

```json
{
  "reactionType": "LIKE"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "totalLikes": 42
  }
}
```

---

### 7.3 Get Translation Comments

**GET** `/api/v1/translations/{translationId}/comments`

**Query Parameters**

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| page      | number | Page index (default: 0)      |
| size      | number | Items per page (default: 20) |

**Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "username": "otaku_user",
        "avatarUrl": "url",
        "content": "Amazing translation! Thank you.",
        "createdAt": "2026-01-24T15:00:00Z",
        "replies": []
      }
    ],
    "total": 15
  }
}
```

---

### 7.4 Post Translation Comment

**POST** `/api/v1/translations/{translationId}/comments`

**Request Body**

```json
{
  "content": "Keep up the good work!",
  "parentId": "uuid (optional)"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Keep up the good work!",
    "createdAt": "2026-01-24T16:20:00Z"
  }
}
```

---

## 8️⃣ Discovery & Feed APIs

### 8.1 Get Latest Translations

**GET** `/api/v1/translations/latest`

**Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "translationId": "uuid",
        "mangaTitle": "Solo Leveling",
        "chapterNumber": 180,
        "name": "LevelUp Scans",
        "publishedAt": "2026-01-24T10:00:00Z",
        "stats": {
          "views": 4500,
          "likes": 230
        }
      }
    ]
  }
}
```

---

### 8.2 Get Trending Translations

**GET** `/api/v1/translations/trending`

> Ranked by a combination of view velocity and upvotes.

**Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "translationId": "uuid",
        "mangaTitle": "One Piece",
        "chapterNumber": 1110,
        "stats": {
          "views": 50000,
          "likes": 1200
        }
      }
    ]
  }
}
```

---

## 9️⃣ Profile Integration APIs

### 9.1 Get User's Translations (Work History)

**GET** `/api/v1/users/{username}/translations`

**Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "translationId": "uuid",
        "mangaId": "mal-id",
        "mangaTitle": "Title",
        "chapterNumber": 5,
        "name": "V1",
        "status": "PUBLISHED",
        "publishedAt": "date",
        "stats": {
          "views": 120,
          "likes": 15
        }
      }
    ],
    "totalStats": {
      "totalViews": 5000,
      "totalLikes": 350
    }
  }
}
```

---

## 🔟 Error Codes

| Code | Meaning                  |
| ---- | ------------------------ |
| 400  | Invalid input            |
| 401  | Unauthorized             |
| 403  | Forbidden                |
| 404  | Resource not found       |
| 409  | Invalid state transition |
| 500  | Internal server error    |

---

**End of API Design Document**
