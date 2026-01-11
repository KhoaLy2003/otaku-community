# 🎨 Frontend Implementation Prompt – Anime List Feature

## Context

You are implementing the **Anime List feature** for _Otaku Community_, a youth-oriented social platform.
The goal is to build a **clean, modern, anime-friendly UI** with good UX and clear separation between mock-data development and real API integration.

---

## Scope

- Total pages: **2**
  1. Anime List Page
  2. Anime Detail Page
- Framework: (assume React / Next.js or similar SPA framework)
- Styling: simple, friendly, modern (dark mode friendly, anime-style but not flashy)

---

## Functional Requirements

### Anime List Page

- Two main tabs:
  - **Top Anime**
  - **Seasonal Anime**
- Search bar with filters:
  - Keyword
  - Type (TV / Movie / OVA)
  - Status (Airing / Finished)
- Pagination:
  - Page-based
  - **50 items per page**
- Hover interaction:
  - Hover on anime card → show **small modal / tooltip**
  - Show:
    - Title
    - Score
    - Type
    - Status
- Loading state:
  - Skeleton or spinner while loading data

---

### Anime Detail Page

- Display:
  - Poster
  - Title
  - Synopsis
  - Score
  - Episodes
  - Status
  - Genres
- Back button:
  - Returns to **previous list state** (tab, page, filters)
- Loading state while fetching detail data

---

## Phase-based Implementation

---

## Phase 1 – UI + Mock Data

### Goal

- Fully implement UI and user interactions
- Use **mock data loaded from local JSON files**
- No real API calls

### Instructions

- Create:
  - `/anime` → Anime List Page
  - `/anime/:id` → Anime Detail Page
- Load mock responses from local files:
  - Top Anime list
  - Seasonal Anime list
  - Anime Detail
- The mock data structure follows **internal API response format**
- Pagination logic handled on frontend using mock data
- Hover modal uses mock data fields

### Deliverables

- Fully functional UI
- Clean component structure:
  - AnimeCard
  - AnimeHoverModal
  - AnimeTabs
  - Pagination
  - FilterBar
- Loading states simulated with timeout

---

## Phase 2 – Integrate Backend API

### Goal

- Replace mock data with real API calls
- Keep UI unchanged

### Instructions

- Call backend endpoints:
  - `GET /api/v1/anime/trending`
  - `GET /api/v1/anime/seasonal`
  - `GET /api/v1/anime/search`
  - `GET /api/v1/anime/{id}`
- Maintain pagination (50 items/page)
- Handle loading, error, empty states
- Preserve list state when navigating to detail and back

### Deliverables

- Real data rendering
- Proper API error handling
- Optimized UX for loading transitions

---

## UX Notes

- Prioritize image-first design
- Avoid information overload
- Smooth hover interactions
- Friendly typography for young users

---

## Output Expectation

- Production-ready frontend code
- Clear separation between UI and data-fetching logic
- Easy to extend for future features (post-anime linking)

---

---

# 🛠️ Backend Implementation Prompt – Anime List Feature

## Context

You are implementing backend APIs for the **Anime List feature** using **Jikan API** as an external data source.
The backend must act as an **abstraction layer**, exposing stable internal APIs to the frontend.

---

## Scope

Implement the following APIs:

- Search Anime
- Anime Detail
- Top / Trending Anime
- Seasonal Anime

Based on the previously defined API document structure.

---

## Phase-based Implementation

---

## Phase 1 – Proxy + Mapping Layer (No Database)

### Goal

- Fetch data from Jikan API
- Map external responses to **internal DTOs**
- Return normalized data to client

### Instructions

- Create a dedicated **Jikan API client**
- For each endpoint:
  - Call corresponding Jikan endpoint
  - Map fields:
    - `mal_id` → `externalId`
    - `images.jpg.image_url` → `imageUrl`
    - Normalize enums (status, type)
  - Return internal response structure
- Do NOT persist data
- Add basic error handling and logging

### Endpoints to Implement

- `GET /api/v1/anime/search`
- `GET /api/v1/anime/{id}`
- `GET /api/v1/anime/trending`
- `GET /api/v1/anime/seasonal`

### Deliverables

- Internal DTOs
- Mapping layer
- External API adapter
- Working APIs returning mapped data

---

## Phase 2 – Persistence Layer (Internal Database)

### Goal

- Store anime data internally
- Reduce dependency on external API
- Improve performance and consistency

### Instructions

- Introduce internal entities:
  - Anime (snapshot-based)
- On API request:
  - Check internal database first
  - If data missing or outdated:
    - Fetch from Jikan
    - Map and persist
- Save:
  - externalId
  - title
  - imageUrl
  - synopsis
  - score
  - status
  - type
  - lastSyncedAt
- Keep external API as **fallback only**

### Deliverables

- Database schema
- Repository layer
- Sync/update logic
- Stable internal APIs independent of Jikan uptime

---

## Architectural Guidelines

- External API logic isolated in integration module
- Internal DTOs never expose Jikan schema
- Designed for future Redis caching layer
- Clean separation:
  - Controller
  - Service
  - Integration client
  - Mapper
  - Repository

---

## Non-goals (Out of Scope)

- User watchlist
- Rating submission
- Recommendation logic
- Character deep integration

---

## Output Expectation

- Clean, maintainable backend code
- Easy to extend for Phase 3 (cache, recommendation, community)
- Production-ready API contracts

---

## Final Note

Treat Jikan as a **knowledge provider**, not a core dependency.
Your backend defines the rules, structure, and stability.
