# 📄 FEED SYSTEM DESIGN SUMMARY

## 1. Overview

This document summarizes the design of a scalable social feed system using **Fan-out on Write (FoW)** and **Fan-out on Read (FoR)** strategies, focusing on how user actions (follow, hide, like, etc.) affect feed generation and how new or low-follow users are handled.

The system is designed in a **Facebook-style architecture**, prioritizing fast feed reads, personalization, and scalability.

---

## 2. Core Concepts

### 2.1 Fan-out on Write (FoW)

**Definition**
When a post is created or a relevant user action occurs, feed entries are **precomputed and written** into a dedicated `user_feed` table for each target user.

**Key Characteristics**

- Heavy write operations
- Extremely fast feed reads
- Feed ranking is precomputed

**Schema Example**

```text
user_feed
- user_id
- post_id
- score
- reason
- created_at
```

---

### 2.2 Fan-out on Read (FoR)

**Definition**
Feed entries are computed dynamically when a user requests their feed by querying posts, follows, topics, and other relations at read time.

**Key Characteristics**

- Lightweight writes
- Heavy, complex reads
- Ranking computed at query time

---

## 3. Purpose of `user_feed`

The `user_feed` table is a **denormalized, precomputed feed cache**.

> [!IMPORTANT]
> To ensure consistency and minimize write amplification, `user_feed` only stores **Post IDs and Ranking Scores**. It does NOT store post content (text, media URLs). Content is fetched from the primary `posts` table at read time.

It answers the question:

> _Which posts should a specific user see, in what order, and why?_

**Responsibilities**

- Maps user → post
- Stores feed ranking score
- Records the reason a post appears (FOLLOW, FRIEND, GROUP, etc.)
- Enables fast pagination and ordering

---

## 4. Handling User Actions

### 4.1 Follow / Unfollow

| Action   | Fan-out on Write                       | Fan-out on Read |
| -------- | -------------------------------------- | --------------- |
| Follow   | Backfill recent posts into `user_feed` | No action       |
| Unfollow | Delete related `user_feed` rows        | No action       |

---

### 4.2 Hide / Unhide Post

| Action      | Fan-out on Write                     | Fan-out on Read              |
| ----------- | ------------------------------------ | ---------------------------- |
| Hide post   | Delete or flag record in `user_feed` | Store in `user_hidden_posts` |
| Unhide post | Reinsert feed entry (if relevant)    | Delete hide record           |

---

### 4.3 Like / Comment

| Strategy | Behavior                         |
| -------- | -------------------------------- |
| FoW      | Update feed score asynchronously |
| FoR      | Recalculate score during query   |

---

### 4.4 Block User

| Strategy | Behavior                                  |
| -------- | ----------------------------------------- |
| FoW      | Remove all feed entries from blocked user |
| FoR      | Filter blocked users at query time        |

---

## 5. New User Feed Behavior

### 5.1 Initial State

- `user_feed` is **empty** for new users
- No precomputed feed until user actions occur

---

### 5.2 Explore / Default Feed

When `user_feed` is empty, show **Explore Feed** (FoR):

- Trending posts
- Popular posts
- Recent high-engagement content

This feed is **not stored** in `user_feed`.

---

### 5.3 Onboarding Backfill

When a user:

- Follows someone
- Selects topics of interest
- Joins a group

→ Backfill a limited number of recent posts into `user_feed`

---

## 6. Users with Few Follows

### Problem

Users who follow few accounts would otherwise see very few posts.

### Solution: Composite Feed

The feed is built from **multiple sources**:

| Source          | Description                       |
| --------------- | --------------------------------- |
| Personal feed   | Follow, friend, group posts (FoW) |
| Topic feed      | Interest-based posts              |
| Explore feed    | Trending / popular posts          |
| Recommendations | Suggested content                 |

Feed entries are **merged and ranked together**.

---

## 7. Feed Mixing Strategy

### Example Distribution (20 posts per page)

| Source          | Count |
| --------------- | ----- |
| Follow / Friend | 8     |
| Topic-based     | 6     |
| Trending        | 4     |
| Random explore  | 2     |

Ratios are **dynamic** and adjust based on user behavior.

---

## 8. Why Explore Posts Are Not Stored in `user_feed`

- Not strongly personalized
- Frequently changing
- Prevents table bloat
- Easier experimentation and A/B testing

---

## 9. Hybrid Strategy (Advanced)

For high-follower accounts (celebrities):

```text
Low follower count → Fan-out on Write
High follower count → Fan-out on Read
```

This avoids massive fan-out writes while maintaining performance.

---

## 10. Data Consistency (MVP Approach)

To maintain consistency without complex background workers, we use **Lazy Filtering** at read time.

**Workflow:**

1. Fetch candidate `post_ids` from `user_feed`.
2. Query primary `posts` table for these IDs.
3. **Filter out** entries where:
   - Post is deleted or soft-deleted.
   - Author is banned or blocked.
   - Post is already hidden by the user.

---

## 11. Ranking Signals

Feed ranking is determined by a combination of factors:

- **Recency (Time Decay)**: Newer posts receive higher initial scores.
- **Affinity**: Strength of relationship between the viewer and the author (likes, comments, clicks).
- **Engagement**: Total interactions (likes, shares, comments) on a post.
- **Negative Signals**: Penalties for reports or "show fewer like this" actions.

---

## 12. Pagination Strategy

**Cursor-based Pagination** is used to ensure stability in dynamic feeds.

- Prevent duplicate items when new posts are inserted at the top.
- Use `(score, created_at, post_id)` as the cursor for consistent ordering.

---

## 13. Data Retention & Cleanup

To prevent storage bloat in the `user_feed` table:

- **Limit per User**: Keep only the top X (e.g., 500-1000) most relevant posts per user.
- **Time-to-Live (TTL)**: Automatically expire entries older than 30 days.
- **Janitor Job**: Periodic background process to purge stale entries (deleted posts, inactive users).

---

## 14. Final Conclusions

- `user_feed` is the backbone of personalized feeds, storing IDs/Scores for speed.
- Fan-out on Write ensures fast, scalable feed reads for the majority of users.
- Hybrid strategies handle celebrities and new users gracefully.
- Lazy filtering ensures data consistency for the MVP.
- Continuous tuning of mixing ratios and ranking signals is key to engagement.
