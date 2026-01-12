# 🔧 Feature Enhancement & Update Log

> **Project:** Otaku Community
> **Module / Feature:** Jikan Integration, Post Comment
> **Document Type:** Enhancement
> **Last Updated:** 2026-01-08
> **Maintainer:** Backend / Frontend Team

---

## ✅ Enhancement Checklist (Quick View)

> 🔔 **Newest updates are listed first**

- [x] `<ENH-JIKAN-002>` Support seasonal anime listing by year & season
- [ ] `<ENH-COMMENT-001>` Enable image upload for post comments

---

## 📌 Enhancement Summary

| ID              | Type        | Status    | Short Description                     | Impact |
| --------------- | ----------- | --------- | ------------------------------------- | ------ |
| ENH-JIKAN-002   | Enhancement | Completed | Add seasonal anime APIs (year/season) | High   |
| ENH-COMMENT-001 | Enhancement | Planned   | Support image upload in comments      | Medium |

---

## 🔼 Latest Updates

---

### 🆕 `ENH-JIKAN-002` – Seasonal Anime Support (Year / Season)

**Type:** Enhancement
**Status:** Completed
**Release Target:** Phase 2 – Jikan Integration Enhancement
**Priority:** High

#### 🎯 Goal

Extend the current Jikan integration to support **seasonal anime browsing** by:

- Allowing users to view available anime seasons by year
- Allowing users to browse anime by a selected year and season

This enhances discoverability and aligns with common anime community use cases.

---

#### 🔁 Change Description

- Integrate new Jikan API to retrieve available seasons:
  - `GET /seasons`
- Integrate seasonal anime API:
  - `GET /seasons/{year}/{season}`
- Seasonal anime response structure is aligned with existing `/seasons/now`
- Extend internal API to expose:
  - List of available seasons (year + season)
  - Anime list by selected season

---

#### 🧩 Affected Components

- **External API:** Jikan `/seasons`, `/seasons/{year}/{season}`
- **Backend API:** Anime Seasonal endpoints
- **Service:** AnimeService
- **DTO / Mapping:** SeasonalAnimeDto, SeasonMetaDto
- **Cache:** Redis (season list, seasonal anime list)
- **Frontend:** Anime List page (Season tab)

---

#### ⚠️ Backward Compatibility

- [x] No breaking change
- [ ] Minor behavior change
- [ ] Requires frontend update
- [ ] Requires data migration

---

#### 🧪 Testing Notes

- Validate year/season combinations
- Handle empty or upcoming seasons
- Ensure caching TTL does not serve outdated seasonal data
- Verify pagination consistency with existing anime list

---

#### 📎 Reference

- Jikan API Docs – Seasons
- Related feature: Anime List (Top / Seasonal)

---

---

### 🆕 `ENH-COMMENT-001` – Image Upload Support for Post Comments

**Type:** Enhancement
**Status:** Planned
**Release Target:** Phase 2 – Post Enhancement
**Priority:** Medium

---

#### 🎯 Goal

Enhance post comments by allowing users to **attach images** , instead of text-only comments, improving expressiveness and engagement.

---

#### 🔁 Change Description

- Extend comment creation to support:
  - Text-only comment (existing)
  - Image-only comment
  - Text + image comment
- Add image upload handling:
  - Validate image type and size
  - Store image via existing media storage mechanism
- Update comment response to include image metadata

---

#### 🧩 Affected Components

- **API:** Comment create / get endpoints
- **Service:** CommentService
- **Storage:** Media / Image storage service
- **Database:** Comment table (image URL / metadata)
- **Frontend:** Comment input UI, comment display

---

#### ⚠️ Backward Compatibility

- [x] No breaking change
- [ ] Minor behavior change
- [x] Requires frontend update
- [ ] Requires data migration

---

#### 🧪 Testing Notes

- Upload invalid file types
- Upload large images
- Mixed text + image comments
- Rendering comments with and without images

---

#### 📎 Reference

- Related feature: Post & Comment system
- Media upload guidelines

---

## 🧠 Known Limitations / Follow-ups

- Seasonal anime data may change over time → rely on TTL-based cache invalidation
- Comment image moderation not included in this phase
- No multiple-image support for comments (single image only)

---

## ✍️ Change Log

| Date       | ID              | Type        | Author       | Note          |
| ---------- | --------------- | ----------- | ------------ | ------------- |
| 2026-01-08 | ENH-JIKAN-002   | Enhancement | Backend Team | Initial draft |
| 2026-01-08 | ENH-COMMENT-001 | Enhancement | Backend Team | Initial draft |

---
