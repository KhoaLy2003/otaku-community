# ADR-001: Jikan API Integration

**Status:** Accepted
**Date:** 2026-01-08
**Decision Makers:** Solo Developer

---

## Context

The platform needs a comprehensive source of anime/manga data to support community discussions, tagging, and future discovery features. Building an internal database from scratch is resource-intensive, while using a live external API introduces reliability and rate-limit risks.

## Decision

**We will integrate Jikan API as a read-only external data source, using a "Snapshot" strategy.**

**Core Strategy:**

1. **External Data Provider:** Jikan API (Unofficial MyAnimeList API).
2. **Snapshot Models:** Internal database stores a "snapshot" of the external data (Anime, Manga tables) to decouple from live API availability.
3. **One-Way Sync:** Data flows from Jikan -> Internal DB. No write-back.
4. **Caching:** Redis (or similar) used to cache API responses to respect rate limits.

## Rationale

1. **Decoupling:** By storing snapshots, the platform continues to function even if Jikan APIs are down or change. Key social features (posts, comments) rely on internal IDs, not external ones.
2. **Performance:** Serving data from the internal DB is faster than proxying external API calls constantly.
3. **Consistency:** Post relations need stable references. Internal UUIDs provide this stability regardless of external ID changes.

## Consequences

### Positive

- ✅ Resilient to external API downtime.
- ✅ Fast read performance for internal features.
- ✅ Stable references for posts and topics.

### Negative

- ⚠️ Data may become stale (requires sync strategy).
- ⚠️ Increased storage requirements for duplicating data.

## Mapping Strategy

**Jikan API Response** -> **DTO** -> **Mapper** -> **Internal Domain Snapshot**

- **Anime Table:** Stores `id`, `external_id`, `title`, `image_url`, `synopsis`, `type`, `status`.
- **Manga Table:** Similar structure for manga.

## References

- [Jikan API Documentation](https://jikan.moe/docs)
