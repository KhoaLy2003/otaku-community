# ADR-002: Feed System Architecture

**Status:** Accepted
**Date:** 2025-12-26

---

## Context

A core feature of the platform is a personalized social feed. Users should see posts from people and topics they follow. As the user base grows, generating this feed on-the-fly (Fan-out on Read) becomes expensive and slow.

## Decision

**We will use a Hybrid Feed Architecture combining Fan-out on Write (FoW) and Fan-out on Read (FoR).**

## Core Concepts

### Fan-out on Write (FoW)

- **Mechanism:** When a post is created, it is precomputed and written to a `user_feed` table for every follower.
- **Usage:** Used for the majority of users who have a separate `user_feed` cache.
- **Benefit:** Extremely fast read performance (`SELECT * FROM user_feed WHERE user_id = ?`).

### Fan-out on Read (FoR)

- **Mechanism:** Feed is constructed at query time by joining posts with follows/topics.
- **Usage:**
  - **New Users:** Empty `user_feed`, fallback to "Explore" or "Trending".
  - **Celebrities/High-Volume Topics:** To avoid massive write amplification, posts from high-follower accounts may be merged at read time.
  - **Explore Feed:** Global trending content is not precomputed per user.

## Data Schema

### `user_feed` Table

- `user_id` (Who sees the post)
- `post_id` (The post)
- `score` (Ranking score)
- `created_at` (For sorting)

_Note: Content is NOT stored in `user_feed`, only references._

## Handling Actions

- **Follow User:** Backfill recent posts into `user_feed`.
- **Unfollow:** Delete related rows from `user_feed`.
- **Block:** Remove entries or filter at read time.

## Rationale

1. **Performance:** Reading precomputed feeds is O(1) for the fetch, vs O(N) joins for on-the-fly generation.
2. **Scalability:** FoW shifts the load to write-time (async), which is more manageable than read-time latency.
3. **Flexibility:** Hybrid approach allows handling edge cases (new users, viral posts) without the downsides of a pure FoW or FoR system.

## Consequences

- ✅ Fast home feed loading.
- ✅ Scalable for most user interactions.
- ⚠️ Write amplification (creating a post triggers N writes).
- ⚠️ Complexity in maintaining `user_feed` consistency (requires reliable async workers).

## References

- Facebook Feed Architecture
- Twitter Fan-out Strategy
