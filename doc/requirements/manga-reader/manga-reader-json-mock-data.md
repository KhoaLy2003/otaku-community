# 📦 Mock Data (JSON) – Manga Translation Feature

This document contains **JSON mock data files** used by the frontend **before server integration** .

The data structure is aligned with:

- Database schema
- API design (upload job, translation, pages, publish flow)

---

## 1️⃣ `manga.json` (use from manga jikan integration)

---

## 2️⃣ `translations.list.json`

```json
{
  "chapterId": "chapter_001",
  "translations": [
    {
      "id": "translation_001",
      "name": "English Scanlation",
      "translator": {
        "id": "user_101",
        "username": "otaku_translator"
      },
      "status": "PUBLISHED",
      "createdAt": "2026-01-10T09:12:00Z",
      "publishedAt": "2026-01-11T03:00:00Z"
    },
    {
      "id": "translation_002",
      "name": "Vietnamese Fan Translation",
      "translator": {
        "id": "user_202",
        "username": "vn_scan"
      },
      "status": "PUBLISHED",
      "createdAt": "2026-01-12T14:20:00Z",
      "publishedAt": "2026-01-12T18:45:00Z"
    }
  ]
}
```

---

## 3️⃣ `translation.detail.json`

```json
{
  "id": "translation_001",
  "chapterId": "chapter_001",
  "name": "English Scanlation",
  "notes": "Translated by Otaku Team",
  "status": "PUBLISHED",
  "pages": [
    {
      "id": "page_001",
      "pageIndex": 0,
      "imageUrl": "https://cdn.example.com/translations/001/page_01.jpg"
    },
    {
      "id": "page_002",
      "pageIndex": 1,
      "imageUrl": "https://cdn.example.com/translations/001/page_02.jpg"
    },
    {
      "id": "page_003",
      "pageIndex": 2,
      "imageUrl": "https://cdn.example.com/translations/001/page_03.jpg"
    }
  ]
}
```

---

## 4️⃣ `upload-job.create.response.json`

```json
{
  "uploadJobId": "upload_789",
  "translationId": "translation_draft_001",
  "status": "UPLOADING",
  "totalPages": 20,
  "uploadedPages": 0
}
```

---

## 5️⃣ `upload-job.progress.json`

```json
{
  "uploadJobId": "upload_789",
  "status": "UPLOADING",
  "totalPages": 20,
  "uploadedPages": 12,
  "progress": 60
}
```

---

## 6️⃣ `upload-job.completed.json`

```json
{
  "uploadJobId": "upload_789",
  "translationId": "translation_draft_001",
  "status": "COMPLETED",
  "totalPages": 20,
  "uploadedPages": 20
}
```

---

## 7️⃣ `translation.draft.json`

```json
{
  "id": "translation_draft_001",
  "chapterId": "chapter_001",
  "name": "English Draft",
  "notes": "Needs proofreading",
  "status": "DRAFT",
  "pages": [
    {
      "id": "page_d_001",
      "pageIndex": 0,
      "imageUrl": "blob://local/page_01"
    },
    {
      "id": "page_d_002",
      "pageIndex": 1,
      "imageUrl": "blob://local/page_02"
    }
  ]
}
```

---

## 8️⃣ `reorder-pages.request.json`

```json
{
  "pages": [
    { "pageId": "page_d_002", "pageIndex": 0 },
    { "pageId": "page_d_001", "pageIndex": 1 }
  ]
}
```

---

## 9️⃣ `publish.translation.response.json`

```json
{
  "id": "translation_001",
  "status": "PUBLISHED",
  "publishedAt": "2026-01-15T10:00:00Z"
}
```

---

## 🔟 `translator.dashboard.json`

```json
{
  "translations": [
    {
      "id": "translation_001",
      "chapter": "Chapter 1",
      "status": "PUBLISHED",
      "createdAt": "2026-01-10T09:12:00Z"
    },
    {
      "id": "translation_draft_001",
      "chapter": "Chapter 2",
      "status": "DRAFT",
      "createdAt": "2026-01-14T16:30:00Z"
    }
  ]
}
```

---

## ✅ Usage Notes

- These JSON files can be used directly with:
  - MSW (Mock Service Worker)
  - MirageJS
  - Local static mocks
- Page order is controlled via `pageIndex`
- Upload progress is simulated via polling or websocket mock

---

**End of Mock Data Document**
