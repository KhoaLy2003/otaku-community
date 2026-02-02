# 📄 Feature Specification: News Advanced Features

## 1️⃣ Feature Overview

- **Feature Name**: News Advanced Features (Search, Bookmarks, Trending, Related Content)
- **Description**: Enhanced news functionality including full-text search, user bookmarks, trending algorithm, and content linking to anime/manga database. These features build upon the core RSS feed system.
- **Status**: Future Phase

---

## 2️⃣ User Stories

### Search Functionality

| ID              | As a     | I want to                           | So that                                        | Status  |
| :-------------- | :------- | :---------------------------------- | :--------------------------------------------- | :------ |
| **US-NEWS-101** | Any User | search news by keywords             | I can find specific articles or topics quickly | Planned |
| **US-NEWS-102** | Any User | see search suggestions as I type    | I can discover relevant topics                 | Planned |
| **US-NEWS-103** | Any User | filter search results by date range | I can find news from a specific time period    | Planned |

### User Bookmarks & Read Later

| ID              | As a            | I want to                                 | So that                                       | Status  |
| :-------------- | :-------------- | :---------------------------------------- | :-------------------------------------------- | :------ |
| **US-NEWS-201** | Registered User | bookmark news articles                    | I can save interesting articles to read later | Planned |
| **US-NEWS-202** | Registered User | view my saved/bookmarked news             | I can access my reading list                  | Planned |
| **US-NEWS-203** | Registered User | remove bookmarks                          | I can manage my saved articles                | Planned |
| **US-NEWS-204** | Registered User | see if I've already bookmarked an article | I don't save duplicates                       | Planned |

### Trending & Recommendations

| ID              | As a            | I want to                             | So that                                        | Status  |
| :-------------- | :-------------- | :------------------------------------ | :--------------------------------------------- | :------ |
| **US-NEWS-301** | Any User        | see trending news articles            | I can discover what's popular in the community | Planned |
| **US-NEWS-302** | Registered User | get personalized news recommendations | I see content relevant to my interests         | Planned |
| **US-NEWS-303** | Any User        | see view counts on news articles      | I can gauge popularity and relevance           | Planned |

### Related Content Linking

| ID              | As a     | I want to                                 | So that                                         | Status  |
| :-------------- | :------- | :---------------------------------------- | :---------------------------------------------- | :------ |
| **US-NEWS-401** | Any User | see related anime/manga mentioned in news | I can explore content referenced in articles    | Planned |
| **US-NEWS-402** | Any User | click on anime/manga tags to view details | I can learn more about titles mentioned in news | Planned |
| **US-NEWS-403** | Any User | see related news when viewing anime/manga | I can stay informed about my favorite titles    | Planned |

### Enhanced Categorization

| ID              | As a     | I want to                                    | So that                                      | Status  |
| :-------------- | :------- | :------------------------------------------- | :------------------------------------------- | :------ |
| **US-NEWS-501** | Any User | see multiple categories per news item        | I can understand all relevant topics covered | Planned |
| **US-NEWS-502** | Any User | filter by multiple categories simultaneously | I can narrow down to specific content types  | Planned |
| **US-NEWS-503** | Any User | see trending tags/keywords                   | I can discover popular topics                | Planned |

---

## 3️⃣ Acceptance Criteria (AC)

### 3.1. Search Functionality

**Search Interface:**

- Search bar prominently displayed on news page
- Real-time search suggestions (debounced, min 3 characters)
- Search results page with highlighted keywords
- Advanced filters: date range, source, category
- Search history for registered users (last 10 searches)

**Search Behavior:**

- Full-text search across title, summary, and content
- Fuzzy matching for typos
- Support for Japanese characters (if applicable)
- Results sorted by relevance score
- Pagination for search results

### 3.2. User Bookmarks

**Bookmark Interface:**

- Bookmark icon on each news card (heart or bookmark icon)
- Visual indicator when article is bookmarked (filled icon)
- "My Bookmarks" page in user profile
- Ability to remove bookmarks from list or card
- Bookmark count displayed to user

**Bookmark Logic:**

- Only registered users can bookmark
- One bookmark per user per article
- Bookmarks persist across sessions
- Bookmarks ordered by date added (newest first)
- Export bookmarks as list (future enhancement)

### 3.3. Trending Algorithm

**Trending Calculation:**

- Factors:
  - View count (weight: 40%)
  - Recency (weight: 30%)
  - Bookmark count (weight: 20%)
  - External link clicks (weight: 10%)
- Time decay: older articles lose trending score
- Recalculated every 15 minutes
- Trending period: last 7 days

**Trending Display:**

- "Trending Now" section on homepage
- Trending badge on hot articles
- Top 10 trending articles in sidebar
- Trending score visible to admins only

### 3.4. Related Content Linking

**Content Extraction:**

- Use NLP/regex to extract anime/manga titles from news
- Match extracted titles against Jikan database
- Store relationships in junction table
- Manual override for incorrect matches (admin feature)

**Display:**

- "Related Anime/Manga" section on news detail page
- Clickable cards with poster images
- Max 5 related items per article
- Bidirectional linking (news ↔ anime/manga)

### 3.5. Enhanced Categorization

**Multi-Category Support:**

- Articles can have 1-5 categories
- Primary category (required) + secondary categories (optional)
- Category tags displayed as badges
- Filter by any combination of categories

**Tag System:**

- Auto-extracted keywords from content
- Manual tags added by admins
- Tag cloud showing popular tags
- Click tag to filter news

---

## 4️⃣ Technical Specifications

### 4.1. Search API

**Endpoints:**

- `GET /api/v1/news/search`: Full-text search
  - Query params: `q` (query), `source`, `category`, `from`, `to`, `page`, `size`
  - Response: `PagedResponse<NewsDto>` with relevance scores
- `GET /api/v1/news/search/suggestions`: Search autocomplete
  - Query params: `q` (query), `limit`
  - Response: `List<String>` (suggested queries)

**Implementation:**

- PostgreSQL full-text search using `tsvector` and `tsquery`
- Create GIN index on searchable columns
- Alternative: Elasticsearch integration for advanced search

```sql
-- Add full-text search column
ALTER TABLE news ADD COLUMN search_vector tsvector;

-- Create trigger to update search_vector
CREATE TRIGGER news_search_update
BEFORE INSERT OR UPDATE ON news
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.english', title, summary, content);

-- Create GIN index
CREATE INDEX idx_news_search ON news USING GIN(search_vector);
```

### 4.2. Bookmarks API

**Endpoints:**

- `POST /api/v1/news/{id}/bookmark`: Add bookmark
  - Auth: Required
  - Response: `BookmarkDto`
- `DELETE /api/v1/news/{id}/bookmark`: Remove bookmark
  - Auth: Required
  - Response: 204 No Content
- `GET /api/v1/users/me/bookmarks`: Get user's bookmarks
  - Auth: Required
  - Query params: `page`, `size`
  - Response: `PagedResponse<NewsDto>`

**Database Schema:**

```sql
CREATE TABLE news_bookmark (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    news_id BIGINT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, news_id)
);

CREATE INDEX idx_bookmark_user ON news_bookmark(user_id);
CREATE INDEX idx_bookmark_news ON news_bookmark(news_id);
```

### 4.3. Trending System

**Endpoints:**

- `GET /api/v1/news/trending`: Get trending news
  - Query params: `limit`, `period` (7d, 30d)
  - Response: `List<NewsDto>` with trending scores

**Database Schema:**

```sql
CREATE TABLE news_metrics (
    news_id BIGINT PRIMARY KEY REFERENCES news(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    trending_score DECIMAL(10, 2) DEFAULT 0,
    last_calculated_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metrics_trending ON news_metrics(trending_score DESC);
```

**Trending Score Calculation:**

```java
public double calculateTrendingScore(NewsMetrics metrics, LocalDateTime publishedAt) {
    double viewScore = metrics.getViewCount() * 0.4;
    double bookmarkScore = metrics.getBookmarkCount() * 0.2;
    double clickScore = metrics.getClickCount() * 0.1;

    // Time decay: reduce score by 10% per day
    long daysOld = ChronoUnit.DAYS.between(publishedAt, LocalDateTime.now());
    double recencyScore = Math.max(0, 100 - (daysOld * 10)) * 0.3;

    return viewScore + bookmarkScore + clickScore + recencyScore;
}
```

### 4.4. Related Content API

**Endpoints:**

- `GET /api/v1/news/{id}/related-anime`: Get related anime
  - Response: `List<AnimeDto>`
- `GET /api/v1/news/{id}/related-manga`: Get related manga
  - Response: `List<MangaDto>`
- `GET /api/v1/anime/{id}/news`: Get news about anime
  - Response: `List<NewsDto>`

**Database Schema:**

```sql
CREATE TABLE news_anime_relation (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    anime_mal_id INTEGER NOT NULL,
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_relation_news ON news_anime_relation(news_id);
CREATE INDEX idx_relation_anime ON news_anime_relation(anime_mal_id);
```

### 4.5. Enhanced Categories

**Database Schema:**

```sql
CREATE TABLE news_category_mapping (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_mapping_news ON news_category_mapping(news_id);
CREATE INDEX idx_category_mapping_category ON news_category_mapping(category);

CREATE TABLE news_tag (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tag_news ON news_tag(news_id);
CREATE INDEX idx_tag_tag ON news_tag(tag);
```

---

## 5️⃣ Performance & Security

**Search Performance:**

- Full-text search response time: < 200ms
- Cache popular search queries (Redis, 10-minute TTL)
- Limit search results to 100 items max
- Implement search rate limiting (10 requests/minute per user)

**Bookmark Performance:**

- Bookmark operations: < 100ms
- Cache user's bookmark list (Redis, 5-minute TTL)
- Invalidate cache on bookmark add/remove

**Trending Calculation:**

- Background job runs every 15 minutes
- Cache trending list (Redis, 15-minute TTL)
- Async metric updates (don't block user requests)

**Related Content Performance:**

- Pre-calculate relationships during RSS sync
- Cache related content (Redis, 1-hour TTL)
- Limit to 5 related items per article

**Security:**

- Authenticate bookmark operations (JWT)
- Validate user owns bookmark before deletion
- Sanitize search queries (prevent SQL injection)
- Rate limit search and bookmark APIs

---

## 6️⃣ Edge Cases & Error Handling

**Search Edge Cases:**

- Empty search query: return validation error
- No results found: show "No news found for '{query}'" message
- Special characters in query: sanitize and escape
- Very long queries: truncate to 200 characters

**Bookmark Edge Cases:**

- Bookmark already exists: return existing bookmark (idempotent)
- News article deleted: cascade delete bookmarks
- User deleted: cascade delete bookmarks
- Bookmark non-existent article: return 404

**Trending Edge Cases:**

- No trending articles: show "No trending news" message
- All articles equally popular: sort by recency
- Calculation failure: use cached trending list

**Related Content Edge Cases:**

- No related content found: hide section
- Anime/manga not in database: skip relationship
- Multiple matches for title: use highest confidence score
- Broken links: handle gracefully with fallback

**Multi-Category Edge Cases:**

- No categories assigned: use default "ANIME"
- Conflicting categories: prioritize primary category
- Too many categories: limit to 5 max
