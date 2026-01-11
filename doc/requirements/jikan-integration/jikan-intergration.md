# 📦 MVP Feature List – Third-party API Integration (Jikan)

## Data Source

- API: https://jikan.moe/
- Domain: Anime, Manga, Character, Staff, News
- Nature: Read-only, public data

---

## 1. Core Anime Features (Highest Priority)

### 1.1 Anime Listing & Detail

**Purpose:** Provide authoritative anime data for posts, profiles, and feeds.

**Features**

- Get anime basic info:
  - Title (EN / JP)
  - Poster image
  - Synopsis
  - Genres
  - Studio
  - Episodes
  - Status (Airing / Finished)
  - Aired date
  - MAL score
- Anime detail page (read-only)

**Relevant APIs**

- `GET /anime`
- `GET /anime/{id}`

✅ **MVP: REQUIRED**

---

### 1.2 Trending / Popular Anime

**Purpose:** Entry point for discovery & engagement.

**Features**

- Top anime (by score / popularity)
- Seasonal anime (current season)
- Simple sorting (score, popularity)

**Relevant APIs**

- `GET /top/anime`
- `GET /seasons/now`

✅ **MVP: REQUIRED**

---

## 2. Manga Features (Medium Priority)

### 2.1 Manga Listing & Detail

**Purpose:** Support manga-focused Otaku users.

**Features**

- Manga basic info:
  - Title
  - Cover image
  - Synopsis
  - Genres
  - Chapters / Volumes
  - Status
  - MAL score

**Relevant APIs**

- `GET /manga`
- `GET /manga/{id}`

🟡 **MVP: OPTIONAL but Recommended**

---

## 3. Anime News Integration (High Engagement, Low Effort)

### 3.1 Anime News Feed

**Purpose:** Keep content fresh without relying on user-generated posts.

**Features**

- News list per anime
- Global anime news feed (read-only)
- Click-through to full article (external link)

**Relevant APIs**

- `GET /anime/{id}/news`

✅ **MVP: REQUIRED**

---

## 4. Character Data (Light MVP Version)

### 4.1 Character Basic Info (Read-only)

**Purpose:** Prepare foundation for character-based features later.

**Features**

- Character name
- Image
- About/description
- Anime/manga appearances

**Relevant APIs**

- `GET /characters/{id}`
- `GET /anime/{id}/characters`

🟡 **MVP: LIMITED (read-only, no follow yet)**

---

## 5. Search & Discovery

### 5.1 Unified Search (Anime / Manga)

**Purpose:** Core usability feature.

**Features**

- Keyword search
- Filter by:
  - Type (TV, Movie, OVA, Manga)
  - Status
- Pagination (cursor or page-based, internal abstraction)

**Relevant APIs**

- `GET /anime?q=`
- `GET /manga?q=`

✅ **MVP: REQUIRED**

---

## 6. Integration with Internal Features (Very Important)

### 6.1 Link Posts to Anime / Manga

**Purpose:** Otaku-specific differentiation.

**Features**

- Post can reference:
  - Anime ID (from Jikan)
  - Manga ID
- Display anime/manga preview card in post
- Store only:
  - External ID
  - Snapshot metadata (title, image)

✅ **MVP: REQUIRED**

---

## 7. Caching Strategy (MVP Level)

### 7.1 Redis Caching for Jikan Data

**Purpose:** Respect rate limits & improve performance.

**Features**

- Cache anime/manga detail responses
- Cache top anime & seasonal lists
- TTL-based invalidation (e.g. 6–24h)

✅ **MVP: REQUIRED**

---

## 8. What NOT to Implement in MVP ❌

These are **Phase 3+** items:

- ❌ Full MAL sync (user watchlist import)
- ❌ User rating sync with MAL
- ❌ Character follow system
- ❌ Staff (VA / Director) deep profiles
- ❌ Advanced recommendation engine
- ❌ Write-back or account linking to MAL

---

## 9. MVP Feature Summary Table

| Feature                   | Priority   |
| ------------------------- | ---------- |
| Anime detail & listing    | ✅ Must    |
| Trending / seasonal anime | ✅ Must    |
| Anime news                | ✅ Must    |
| Search (anime/manga)      | ✅ Must    |
| Post ↔ Anime linking      | ✅ Must    |
| Redis caching             | ✅ Must    |
| Manga basic support       | 🟡 Nice    |
| Character basic info      | 🟡 Limited |

---

## 10. MVP Success Criteria

- Users can:
  - Discover anime easily
  - Read official info & news
  - Attach anime/manga to posts
- System:
  - Does not exceed Jikan rate limits
  - Responds fast via caching
  - Is decoupled from Jikan schema

---

## Final Recommendation

> **For MVP, treat Jikan as a “trusted knowledge provider”, not a social dependency.**  
> The real value comes from **how Otaku Community connects this data to user-generated content**.
