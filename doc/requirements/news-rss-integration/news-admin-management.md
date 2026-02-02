# 📄 Feature Specification: News Admin Management

## 1️⃣ Feature Overview

- **Feature Name**: News Admin Management & RSS Source Configuration
- **Description**: Admin panel for managing RSS news sources, monitoring sync health, manually triggering syncs, and managing news content. Provides operational control and visibility into the news aggregation system.
- **Status**: Future Phase

---

## 2️⃣ User Stories

| ID              | As an | I want to                                       | So that                                                       | Status  |
| :-------------- | :---- | :---------------------------------------------- | :------------------------------------------------------------ | :------ |
| **US-NEWS-601** | Admin | view all configured RSS sources                 | I can see what sources are being monitored                    | Planned |
| **US-NEWS-602** | Admin | add new RSS sources                             | I can expand news coverage to new outlets                     | Planned |
| **US-NEWS-603** | Admin | enable/disable RSS sources                      | I can control which sources are actively synced               | Planned |
| **US-NEWS-604** | Admin | set priority for RSS sources                    | I can control which sources are preferred                     | Planned |
| **US-NEWS-605** | Admin | view sync status and history for each source    | I can monitor system health and troubleshoot issues           | Planned |
| **US-NEWS-606** | Admin | manually trigger RSS sync for a specific source | I can force refresh when needed                               | Planned |
| **US-NEWS-607** | Admin | view sync logs and error messages               | I can diagnose and fix sync failures                          | Planned |
| **US-NEWS-608** | Admin | delete news articles                            | I can remove inappropriate or duplicate content               | Planned |
| **US-NEWS-609** | Admin | edit news categories and tags                   | I can correct misclassified content                           | Planned |
| **US-NEWS-610** | Admin | view news metrics (views, bookmarks, clicks)    | I can understand content performance                          | Planned |
| **US-NEWS-611** | Admin | receive alerts when RSS sources fail            | I can respond quickly to sync issues                          | Planned |
| **US-NEWS-612** | Admin | configure sync intervals per source             | I can optimize sync frequency based on source update patterns | Planned |

---

## 3️⃣ Acceptance Criteria (AC)

### 3.1. User Interface & Layout

**RSS Source Management Page:**

- Table view of all RSS sources with columns:
  - Name
  - URL
  - Priority (1-10, higher = more important)
  - Status (Enabled/Disabled)
  - Last Sync Time
  - Last Sync Status (Success/Failed)
  - Actions (Edit, Delete, Sync Now)
- "Add New Source" button
- Filter by status (All, Enabled, Disabled, Failed)
- Sort by priority, last sync time, or name

**Add/Edit RSS Source Form:**

- Fields:
  - Name (required, unique)
  - URL (required, valid RSS/Atom feed)
  - Priority (1-10, default: 5)
  - Enabled (checkbox, default: true)
  - Sync Interval (minutes, default: 60)
  - Description (optional)
- Validation:
  - Test RSS feed URL before saving
  - Show preview of feed items
  - Warn if feed is invalid or unreachable
- Save and Cancel buttons

**Sync History Page:**

- Timeline view of all sync operations
- Filters: source, status, date range
- Each entry shows:
  - Source name
  - Sync time
  - Status (Success/Failed)
  - Items fetched / new / duplicates
  - Error message (if failed)
  - Duration
- "View Details" button for full logs

**News Management Page:**

- Table of all news articles
- Columns: Title, Source, Category, Published Date, Views, Bookmarks, Actions
- Filters: source, category, date range
- Search by title or content
- Bulk actions: Delete, Change Category
- Edit button for individual articles

**Dashboard Widgets:**

- Total news count
- Active RSS sources
- Failed syncs (last 24 hours)
- Most viewed news (last 7 days)
- Most bookmarked news (last 7 days)
- Sync success rate chart

### 3.2. Business Logic & Validation

**RSS Source Validation:**

- URL must be valid HTTP/HTTPS
- Feed must be valid RSS 2.0 or Atom format
- Test fetch before enabling source
- Prevent duplicate source URLs
- Name must be unique

**Sync Triggering:**

- Manual sync only if last sync > 5 minutes ago (prevent spam)
- Async execution (don't block admin UI)
- Show progress indicator
- Notify admin when complete

**Priority System:**

- Higher priority sources synced first
- Priority affects trending score calculation
- Range: 1 (lowest) to 10 (highest)

**Sync Interval:**

- Minimum: 15 minutes
- Maximum: 24 hours
- Default: 60 minutes
- Per-source configuration

**Error Handling:**

- Log all sync errors with stack traces
- Retry failed syncs with exponential backoff
- Alert admin after 3 consecutive failures
- Auto-disable source after 10 consecutive failures

**News Deletion:**

- Soft delete (mark as deleted, don't remove from DB)
- Cascade delete bookmarks and metrics
- Admin can restore deleted news (within 30 days)
- Hard delete after 30 days

---

## 4️⃣ Technical Specifications

### 4.1. API Architecture

**Admin RSS Source Endpoints:**

- `GET /api/v1/admin/rss-sources`: List all sources
  - Auth: Admin role required
  - Response: `List<RssSourceDto>`
- `POST /api/v1/admin/rss-sources`: Create new source
  - Auth: Admin role required
  - Request: `CreateRssSourceRequest`
  - Response: `RssSourceDto`
- `PUT /api/v1/admin/rss-sources/{id}`: Update source
  - Auth: Admin role required
  - Request: `UpdateRssSourceRequest`
  - Response: `RssSourceDto`
- `DELETE /api/v1/admin/rss-sources/{id}`: Delete source
  - Auth: Admin role required
  - Response: 204 No Content
- `POST /api/v1/admin/rss-sources/{id}/sync`: Trigger manual sync
  - Auth: Admin role required
  - Response: `SyncJobDto`
- `POST /api/v1/admin/rss-sources/{id}/test`: Test RSS feed
  - Auth: Admin role required
  - Response: `RssFeedTestResult`

**Admin Sync History Endpoints:**

- `GET /api/v1/admin/sync-history`: List sync operations
  - Auth: Admin role required
  - Query params: `sourceId`, `status`, `from`, `to`, `page`, `size`
  - Response: `PagedResponse<SyncHistoryDto>`
- `GET /api/v1/admin/sync-history/{id}`: Get sync details
  - Auth: Admin role required
  - Response: `SyncHistoryDetailDto`

**Admin News Management Endpoints:**

- `GET /api/v1/admin/news`: List all news (admin view)
  - Auth: Admin role required
  - Query params: `source`, `category`, `deleted`, `page`, `size`
  - Response: `PagedResponse<NewsAdminDto>`
- `PUT /api/v1/admin/news/{id}`: Update news
  - Auth: Admin role required
  - Request: `UpdateNewsRequest`
  - Response: `NewsAdminDto`
- `DELETE /api/v1/admin/news/{id}`: Soft delete news
  - Auth: Admin role required
  - Response: 204 No Content
- `POST /api/v1/admin/news/{id}/restore`: Restore deleted news
  - Auth: Admin role required
  - Response: `NewsAdminDto`

**Admin Dashboard Endpoints:**

- `GET /api/v1/admin/news/stats`: Get news statistics
  - Auth: Admin role required
  - Response: `NewsStatsDto`

### 4.2. Database Schema

**Enhanced rss_source Table:**

```sql
CREATE TABLE rss_source (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL UNIQUE,
    priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    enabled BOOLEAN DEFAULT true,
    sync_interval_minutes INTEGER DEFAULT 60 CHECK (sync_interval_minutes >= 15),
    description TEXT,
    last_sync_at TIMESTAMP,
    last_sync_status VARCHAR(50),
    last_sync_error TEXT,
    consecutive_failures INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    updated_by BIGINT REFERENCES users(id)
);
```

**Sync History Table:**

```sql
CREATE TABLE rss_sync_history (
    id BIGSERIAL PRIMARY KEY,
    source_id BIGINT NOT NULL REFERENCES rss_source(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- SUCCESS, FAILED, PARTIAL
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    items_fetched INTEGER DEFAULT 0,
    items_new INTEGER DEFAULT 0,
    items_duplicate INTEGER DEFAULT 0,
    error_message TEXT,
    error_stack_trace TEXT,
    triggered_by VARCHAR(50), -- SCHEDULED, MANUAL, RETRY
    triggered_by_user_id BIGINT REFERENCES users(id)
);

CREATE INDEX idx_sync_history_source ON rss_sync_history(source_id);
CREATE INDEX idx_sync_history_status ON rss_sync_history(status);
CREATE INDEX idx_sync_history_started ON rss_sync_history(started_at DESC);
```

**Enhanced News Table:**

```sql
ALTER TABLE news ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE news ADD COLUMN deleted_by BIGINT REFERENCES users(id);
ALTER TABLE news ADD COLUMN updated_by BIGINT REFERENCES users(id);

CREATE INDEX idx_news_deleted ON news(deleted_at) WHERE deleted_at IS NOT NULL;
```

### 4.3. Background Jobs

**Scheduled Sync Job:**

```java
@Scheduled(fixedDelay = 60000) // Check every minute
public void scheduledSync() {
    List<RssSource> sources = rssSourceRepository.findByEnabledTrue();

    for (RssSource source : sources) {
        if (shouldSync(source)) {
            syncService.syncSource(source, TriggerType.SCHEDULED, null);
        }
    }
}

private boolean shouldSync(RssSource source) {
    if (source.getLastSyncAt() == null) return true;

    long minutesSinceLastSync = ChronoUnit.MINUTES.between(
        source.getLastSyncAt(),
        LocalDateTime.now()
    );

    return minutesSinceLastSync >= source.getSyncIntervalMinutes();
}
```

**Cleanup Job:**

```java
@Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
public void cleanupDeletedNews() {
    LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
    newsRepository.hardDeleteOlderThan(cutoff);
}
```

---

## 5️⃣ Performance & Security

**Performance:**

- Admin APIs cached for 1 minute (short TTL for fresh data)
- Sync operations run asynchronously
- Pagination for all list endpoints
- Database indexes on frequently queried columns

**Security:**

- All admin endpoints require ADMIN role
- Audit log for all admin actions
- Rate limiting: 100 requests/minute per admin
- Validate RSS URLs to prevent SSRF attacks
- Sanitize all user inputs

**Monitoring:**

- Log all sync operations
- Alert on consecutive failures (3+)
- Track sync duration and success rate
- Monitor RSS source availability

---

## 6️⃣ Edge Cases & Error Handling

**RSS Source Edge Cases:**

- Invalid RSS URL: show validation error
- Duplicate URL: prevent creation
- Source becomes unreachable: auto-disable after 10 failures
- Malformed RSS feed: log error, skip items

**Sync Edge Cases:**

- Concurrent sync requests: queue and process sequentially
- Very large feeds (1000+ items): process in batches
- Slow RSS source: timeout after 30 seconds
- Network errors: retry with exponential backoff

**News Management Edge Cases:**

- Delete news with bookmarks: cascade delete bookmarks
- Restore deleted news: restore with original data
- Edit non-existent news: return 404
- Bulk delete: confirm before execution

**Permission Edge Cases:**

- Non-admin access: return 403 Forbidden
- Admin deleted/disabled: revoke access immediately
- Session expired: redirect to login
