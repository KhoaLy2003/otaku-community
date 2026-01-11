# 🎨 Frontend Implementation Prompt – Manga Feature

## Context

You are implementing the **Manga feature** for _Otaku Community_.
This feature focuses on **reading-oriented discovery** with a clean, youth-friendly UI and a simple interaction model.

The implementation must clearly separate **UI development using mock data** and **real API integration**.

---

## Scope

- Total pages: **2**
  1. Manga List Page
  2. Manga Detail Page
- Supported features:
  - Manga Search
  - Top Manga
  - Manga Detail
- Framework: SPA framework (React / Next.js or equivalent)
- UI Style:
  - Simple, clean
  - Friendly to young users
  - Content-focused (reading-centric)

---

## Functional Requirements

### Manga List Page

- Two main sections:
  - **Top Manga**
  - **Search Result**
- Search bar with filters:
  - Keyword
  - Status (Publishing / Finished)
  - Type (Manga / Light Novel / One-shot)
- Pagination:
  - Page-based
  - **20 items per page**
- Hover interaction:
  - Hover on manga card → show **small modal / tooltip**
  - Show:
    - Title
    - Score
    - Status
    - Chapters (if available)
- Loading state:
  - Skeleton or spinner while loading data

---

### Manga Detail Page

- Display:
  - Cover image
  - Title
  - Synopsis
  - Chapters
  - Volumes
  - Status
  - Score
  - Genres
- Back button:
  - Returns to **previous list state** (search keyword, page, filters)
- Loading state while fetching detail data

---

## Phase-based Implementation

---

## Phase 1 – UI + Mock Data

### Goal

- Build complete UI and interactions
- Use **mock JSON data** loaded from local files
- No real API calls

### Instructions

- Create:
  - `/manga` → Manga List Page
  - `/manga/:id` → Manga Detail Page
- Mock data files:
  - Top Manga list
  - Manga search results
  - Manga detail
- Mock data follows **internal API response format**
- Pagination handled on frontend (20 items/page)
- Hover modal uses mock data fields
- Simulate loading state with artificial delay

### Deliverables

- Fully interactive UI
- Clear component structure:
  - MangaCard
  - MangaHoverModal
  - SearchBar
  - Pagination
  - FilterBar
- Consistent loading states

---

## Phase 2 – Backend API Integration

### Goal

- Replace mock data with backend APIs
- Keep UI & component structure unchanged

### Instructions

- Call backend endpoints:
  - `GET /api/v1/manga/search`
  - `GET /api/v1/manga/top`
  - `GET /api/v1/manga/{id}`
- Support pagination (20 items/page)
- Handle:
  - Loading
  - Empty results
  - API error states
- Preserve list state when navigating to detail and back

### Deliverables

- Real data rendering
- Stable UX transitions
- Proper error handling

---

## UX Notes

- Emphasize cover image & title
- Keep information density lower than anime
- Smooth hover animations
- Mobile-friendly layout

---

## Output Expectation

- Clean, maintainable frontend code
- Easy extension for:
  - Manga → Post linking
  - Reading progress (Phase 3)

---

---

# 🛠️ Backend Implementation Prompt – Manga Feature

## Context

You are implementing backend APIs for the **Manga feature**, using **Jikan API** as an external data source.
The backend acts as a **normalization and abstraction layer**.

---

## Scope

Implement exactly **3 APIs**:

- Manga Search
- Manga Detail
- Top Manga

Based on the defined API document structure.

---

## Phase-based Implementation

---

## Phase 1 – External API Integration & Mapping

### Goal

- Call Jikan Manga APIs
- Map external schema to **internal DTOs**
- Return clean responses to client

### Instructions

- Implement Jikan API client for manga endpoints
- Map:
  - `mal_id` → `externalId`
  - `images.jpg.image_url` → `imageUrl`
  - Normalize `status`, `type`
- Do NOT store data in database
- Add basic logging and error handling

### Endpoints to Implement

- `GET /api/v1/manga/search`
- `GET /api/v1/manga/{id}`
- `GET /api/v1/manga/top`

### Deliverables

- Internal Manga DTOs
- Mapping layer
- External API adapter
- Working APIs returning mapped data

---

## Phase 2 – Persistence Layer (Internal Snapshot)

### Goal

- Store manga data internally
- Reduce repeated external calls
- Prepare for caching and future features

### Instructions

- Create internal entity:
  - Manga (snapshot-based)
- Request flow:
  - Check internal DB
  - If missing or outdated:
    - Fetch from Jikan
    - Map and persist
- Persist:
  - externalId
  - title
  - imageUrl
  - synopsis
  - chapters
  - volumes
  - status
  - score
  - lastSyncedAt
- External API used as fallback only

### Deliverables

- Database schema
- Repository layer
- Sync logic
- Stable internal APIs

---

## Architectural Guidelines

- Jikan logic isolated in integration module
- Internal DTOs independent from external schema
- Designed for future Redis cache layer
- Clean separation of concerns:
  - Controller
  - Service
  - Integration Client
  - Mapper
  - Repository

---

## Non-goals (Out of Scope)

- User reading list
- Progress tracking
- Rating submission
- Recommendation system

---

## Final Note

Manga integration should feel **lightweight, fast, and content-focused**, preparing the foundation for deeper Otaku features later.
