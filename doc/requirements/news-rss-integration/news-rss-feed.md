# 📄 Feature Specification: News RSS Feed

## 1️⃣ Feature Overview

- **Feature Name**: News RSS Feed System
- **Description**: Aggregate and display anime, manga, and otaku culture news from multiple trusted RSS sources (Crunchyroll, Anime News Network) in a unified feed. Users can browse, filter, and access the latest news from the community.
- **Status**: Implemented

---

## 2️⃣ User Stories

| ID              | As a     | I want to                                                   | So that                                                             | Status      |
| :-------------- | :------- | :---------------------------------------------------------- | :------------------------------------------------------------------ | :---------- |
| **US-NEWS-001** | Any User | view the latest anime and manga news                        | I can stay informed about the community without creating an account | Implemented |
| **US-NEWS-002** | Any User | filter news by category (Anime, Manga, Game, Industry)      | I can focus on topics that interest me                              | Implemented |
| **US-NEWS-003** | Any User | filter news by source (Crunchyroll, ANN)                    | I can read from my preferred news outlets                           | Implemented |
| **US-NEWS-004** | Any User | see news with images and summaries                          | I can quickly scan and decide what to read                          | Implemented |
| **US-NEWS-005** | Any User | click on a news item to read the full article on the source | I can get complete information from the original publisher          | Implemented |
| **US-NEWS-006** | Any User | see when each news item was published                       | I can understand how recent the information is                      | Implemented |
| **US-NEWS-007** | Any User | browse news with pagination                                 | I can explore older news without overwhelming page load             | Implemented |
| **US-NEWS-008** | Any User | see the author of each news article                         | I can identify who wrote the content                                | Implemented |

---

## 3️⃣ Acceptance Criteria (AC)

### 3.1. User Interface & Layout

**News List Page:**

- Display news items in a grid or list layout
- Each news card shows:
  - Thumbnail image (if available)
  - Title (clickable, opens original article in new tab)
  - Summary/excerpt (truncated to ~150 characters)
  - Source badge (Crunchyroll, ANN, etc.)
  - Category badge (Anime, Manga, Game, etc.)
  - Author name (if available)
  - Publication time (relative format: "2 hours ago", "1 day ago")
- Filter controls at the top:
  - Source dropdown (All, Crunchyroll, ANN)
  - Category dropdown (All, Anime, Manga, Game, Industry, Features, etc.)
- Pagination controls at the bottom
- "Latest News" widget in sidebar showing 5-10 most recent items

**Empty States:**

- "No news found" message when filters return no results
- Suggestion to adjust filters or check back later

**Loading States:**

- Skeleton loaders for news cards while fetching
- Smooth transitions when changing filters

### 3.2. Business Logic & Validation

**News Fetching:**

- RSS feeds synced every 60 minutes automatically
- News items deduplicated by URL (link field)
- Only new items are inserted; existing items are not updated
- Failed RSS fetches are logged but don't break the system

**Category Classification:**

- Automatic categorization based on:
  1. RSS feed's native category tags (priority)
  2. Keyword matching in title and summary
  3. Default to "ANIME" if no match found
- Categories: ANIME, MANGA, GAME, INDUSTRY, FEATURES, LATEST_NEWS, ANNOUNCEMENTS, INTERVIEWS, REVIEWS

**Data Sorting:**

- Default sort: newest first (by publishedAt DESC)
- Pagination: 20 items per page (configurable)

**Content Storage:**

- Store: title, summary, link, imageUrl, author, source, category, publishedAt
- Do NOT store full article content (copyright compliance)
- Link directly to source images (no proxying initially)

**Retention Policy:**

- Keep news items for 12 months
- Archive items older than 12 months (soft delete or move to archive table)

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

**Endpoints:**

- `GET /api/v1/news`: Fetch paginated news list
  - Query params: `source`, `category`, `page`, `size`
  - Response: `PagedResponse<NewsDto>`
- `GET /api/v1/news/{id}`: Fetch single news item by ID
  - Response: `NewsDto`
- `GET /api/v1/news/latest`: Fetch latest news (limit 10)
  - Query params: `limit`
  - Response: `List`<NewsDto>```

**Response Model (NewsDto):**

```json
{
  "id": 123,
  "title": "New Anime Announcement",
  "summary": "Brief description...",
  "link": "https://source.com/article",
  "imageUrl": "https://source.com/image.jpg",
  "author": "John Doe",
  "source": "CRUNCHYROLL",
  "category": "ANIME",
  "publishedAt": "2026-02-01T10:30:00Z",
  "fetchedAt": "2026-02-01T11:00:00Z"
}
```

### 4.2. Database Schema

**Table: news**

```sql
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    link VARCHAR(1000) NOT NULL UNIQUE,
    image_url VARCHAR(1000),
    author VARCHAR(255),
    source VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    published_at TIMESTAMP NOT NULL,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_source ON news(source);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_source_category ON news(source, category);
```

**Table: rss_source** (for configuration)

```sql
CREATE TABLE rss_source (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL,
    priority INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    last_sync_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexing:**

- `idx_news_published_at`: For sorting by date
- `idx_news_source`: For filtering by source
- `idx_news_category`: For filtering by category
- `idx_news_source_category`: For combined filters
- `UNIQUE(link)`: Prevent duplicate news items

### 4.3. RSS Sync Service

**Technology:**

- Rome Tools library for RSS/Atom parsing
- Jsoup for HTML cleaning
- Spring Scheduler for periodic sync

**Sync Process:**

1. Fetch RSS XML from configured sources
2. Parse entries using Rome Tools
3. Extract: title, summary, content, link, image, author, categories, publishedAt
4. Clean HTML from description/content
5. Check if link exists in database (deduplication)
6. Classify category using keyword matching
7. Insert new items only
8. Log sync results (fetched count, new count, duplicate count)

**Error Handling:**

- Log RSS fetch failures (network errors, invalid XML)
- Continue with other sources if one fails
- Implement exponential backoff on repeated failures
- Alert admin if source fails for 24+ hours

---

## 5️⃣ Performance & Security

**Performance:**

- Target response time: < 300ms for news list API
- Implement Redis caching for frequently accessed lists (5-minute TTL)
- Lazy load images on frontend
- Use pagination to limit data transfer
- Database query optimization with proper indexes

**Rate Limiting:**

- Respect RSS source servers (sync max once per hour)
- Implement exponential backoff on fetch failures
- No rate limiting on read APIs initially (add if needed)

**Security:**

- Validate and sanitize all RSS content before storage
- Strip potentially malicious HTML/JavaScript from descriptions
- Use HTTPS for all RSS source URLs
- No authentication required for read-only news APIs (public content)

**Optimization:**

- Async RSS fetching (non-blocking)
- Batch insert new news items
- Connection pooling for HTTP requests
- Compress API responses (gzip)

---

## 6️⃣ Edge Cases & Error Handling

**Empty States:**

- "No news available" when database is empty (initial state)
- "No news found for selected filters" when filters return empty
- "Unable to load news" when API fails

**RSS Source Failures:**

- Log error and continue with other sources
- Display cached news if sync fails
- Show warning banner if news is stale (> 24 hours old)

**Invalid RSS Data:**

- Skip items with missing required fields (title, link)
- Use placeholder image if imageUrl is missing or invalid
- Default to "Unknown" for missing author
- Handle malformed dates gracefully (use current time as fallback)

**Duplicate Detection:**

- Use link URL as unique identifier
- Ignore case and trailing slashes in URL comparison
- Handle URL redirects (store canonical URL)

**Image Loading Errors:**

- Show placeholder image if source image fails to load
- Lazy load images to improve page performance
- Handle broken image links gracefully

**Pagination Edge Cases:**

- Handle page number out of range (redirect to last valid page)
- Empty last page (show "No more news" message)
- Maintain filter state across pagination

**Permission Logic:**

- All news is public (no authentication required)
- Future: Registered users can bookmark/save news
