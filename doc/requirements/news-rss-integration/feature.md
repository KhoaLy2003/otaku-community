# News & Content RSS Integration

## 1. Overview

This feature defines a **generic RSS-based News & Content Integration system** for the Otaku Community platform.

Instead of relying on a single provider, the system aggregates news from **multiple official and community-trusted sources** (e.g. Crunchyroll, Anime News Network, Japanese media), normalizes them into a unified model, and exposes them to the platform as a consistent news feed.

The goals are to:

- Provide up-to-date anime, manga, and related culture news
- Support multiple RSS sources with configurable priority
- Avoid heavy crawling or unstable third-party APIs
- Build a scalable **Content Aggregation Layer** that can expand beyond anime and manga

---

## 2. Why Use RSS?

RSS (Really Simple Syndication) is used because it:

- Is officially provided by content publishers
- Requires no API key or authentication
- Is lightweight and stable
- Minimizes legal and ToS risks compared to crawling

Anime News Network offers well-structured RSS feeds, making it ideal for a news feature.

---

## 3. Data Sources

This feature supports **multiple external RSS providers** , with a configurable primary source and optional secondary sources.

### Primary RSS Source

**Crunchyroll News RSS** (Primary)

```text
https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss
```

Crunchyroll is selected as the primary source because:

- It is an official global anime distributor
- News content is closely aligned with anime releases, trailers, and events
- Strong brand trust and long-term stability

### Secondary RSS Sources

**Anime News Network (ANN)**

```text
https://www.animenewsnetwork.com/all/rss.xml
```

ANN provides:

- Industry-level news
- Manga announcements
- Studio, staff, and production updates

### Additional Recommended RSS Sources (Optional)

- **Crunchyroll Industry / Event Feeds** (future expansion)
- **Japanese Media (JP)**
  - Natalie (Anime / Comic)
  - Oricon News (Entertainment)
- **Game-related Media**
  - General game news RSS filtered by anime-style or JP content

All RSS sources are normalized into a unified News model.

---

## 4. Functional Scope

### In-Scope

- Fetch news items from ANN RSS
- Parse and normalize RSS data
- Deduplicate news entries
- Store news in the database
- Expose news via internal APIs for frontend consumption

### Out-of-Scope (for this phase)

- Realtime streaming
- User-personalized news ranking
- AI-based summarization

---

## 5. High-Level Architecture

```text
[ANN RSS Feed]
       ↓
[RSS Fetcher Service]
       ↓
[Parser & Normalizer]
       ↓
[Deduplication]
       ↓
[News Database]
       ↓
[News API]
       ↓
[Frontend / Feed]
```

---

## 6. Data Model

### News Entity (Simplified)

| Field       | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| id          | Long     | Primary key                       |
| title       | String   | News title                        |
| summary     | String   | Short description                 |
| link        | String   | Original ANN article URL (unique) |
| publishedAt | DateTime | Publication date                  |
| source      | String   | `ANIME_NEWS_NETWORK`              |
| category    | String   | ANIME / MANGA / GAME / INDUSTRY   |

A unique constraint is applied on `link` to prevent duplicates.

---

## 7. RSS Ingestion Flow

1. Scheduler triggers RSS sync job
2. System fetches RSS XML from ANN
3. RSS entries are parsed into DTOs
4. Each item is checked for duplication
5. New items are stored in the database
6. Categories are assigned based on keywords

---

## 8. Deduplication Strategy

RSS feeds frequently return previously published items.

**Strategy:**

- Use `link` as a unique identifier
- Ignore items that already exist in the database

This ensures idempotent sync behavior.

---

## 9. Categorization Rules

Basic keyword-based categorization:

- Contains `manga` → MANGA
- Contains `game` → GAME
- Default → ANIME

This logic can later be upgraded to:

- Dictionary-based tagging
- Machine learning / AI tagging

---

## 10. Scheduling Strategy

- Sync interval: **every 30–60 minutes**
- Triggered by Spring Scheduler or background job system

This frequency balances freshness and server load.

---

## 11. Error Handling & Logging

The system should:

- Log RSS fetch failures
- Log number of fetched items
- Log number of newly inserted items
- Continue gracefully if one RSS source fails

---

## 12. Extensibility

This feature is designed to be extensible:

- Add new RSS sources (Crunchyroll, JP media, Game news)
- Add new categories without schema changes
- Combine RSS news with Jikan anime/manga data

---

## 13. Future Enhancements

- Multi-source RSS aggregation
- User-interest-based news filtering
- Trending topic detection
- Auto-translation for Japanese sources
- Recommendation engine integration

---

## 14. Summary

This document describes a **source-agnostic RSS-based News & Content Integration feature** .

Rather than focusing on a single provider, the system:

- Supports multiple RSS sources with defined priorities
- Uses Crunchyroll as the current primary source and Anime News Network as a secondary source
- Normalizes all external content into a unified internal model
- Remains flexible for future expansion (games, events, VTubers, Japanese media)

This design provides a long-term, scalable foundation for building a comprehensive Otaku-focused content ecosystem.
