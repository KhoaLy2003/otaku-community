# 🧠 Feature Update Prompt – Post Enhancement with Anime & Manga Integration

## Context

You are enhancing the existing **Post feature** of *Otaku Community* after integrating **Jikan-based Anime & Manga data**.

The goal is to **increase content depth and contextual relevance** by allowing posts to be **explicitly or implicitly linked** to Anime and/or Manga entities.

This enhancement should:

- Strengthen Otaku-specific discussions
- Improve content discoverability
- Create bi-directional connections between posts and anime/manga

---

## Core Objectives

- Allow users to **link posts to Anime/Manga intentionally**
- Support **automatic detection & linking** when users do not manually link
- Display linked Anime/Manga clearly in Post Detail
- Display related Posts in Anime/Manga Detail pages
- Keep UX intuitive and non-intrusive

---

## Functional Requirements

---

## 1. Post Creation Enhancement

### 1.1 Manual Linking (User-driven)

#### Description

When creating or editing a post, users can **explicitly link** the post to one or more:

- Anime
- Manga

#### Behavior

- Post composer provides:
  - Search & select anime/manga (via internal API)
  - Selected items appear as preview cards inside the composer
- User can:
  - Add multiple references
  - Remove or replace linked items

#### Data Stored

- Post → references:
  - type: `ANIME | MANGA`
  - internalId
  - externalId (optional, internal use)

---

### 1.2 Automatic Linking (System-driven)

#### Description

If the user does **not manually link**, the system attempts to infer relevant Anime/Manga from post content.

#### Behavior

- System analyzes:
  - Post text
  - Embedded links
- Matching strategy (high-level):
  - Keyword matching against known anime/manga titles
  - URL detection (e.g., MAL / AniList links)
- Auto-linked references:
  - Are marked as `autoLinked = true`
  - Can be overridden by user later

#### Constraints

- Auto-linking should:
  - Be conservative (avoid false positives)
  - Prefer high-confidence matches
- Auto-linked items must be visible and editable

---

## 2. Post Detail Page Enhancement

### 2.1 Linked Anime/Manga Display

#### Description

When viewing a post in detail, any linked Anime/Manga should be displayed clearly.

#### UI Behavior

- Show a **reference section**:
  - Anime & Manga cards
  - Poster / cover image
  - Title
  - Type (Anime / Manga)
- Each card is clickable:
  - Navigates to Anime/Manga Detail Page

---

### 2.2 Post Content Priority

- The post content remains primary
- Linked entities act as **contextual enrichment**, not distraction

---

## 3. Anime / Manga Detail Page Enhancement

### 3.1 Related Posts Section

#### Description

Anime/Manga Detail pages should show posts related to that entity.

#### Behavior

- Display a list of posts that:
  - Are manually or automatically linked
- Basic sorting:
  - Most recent
  - Most engaged (likes/comments) – optional

#### UI Behavior

- Section title: “Related Discussions” or equivalent
- Clicking a post navigates to Post Detail Page

---

## 4. Backend Responsibilities (High-level)

### Reference Management

- Maintain many-to-many relationship:
  - Post ↔ Anime
  - Post ↔ Manga
- Distinguish:
  - Manual link
  - Auto link

### APIs (Conceptual)

- Create / update post with references
- Resolve references when fetching post detail
- Fetch posts by animeId / mangaId

---

## 5. Data Consistency Rules

- Deleting a post:
  - Removes references
- Updating post content:
  - May re-trigger auto-linking (if enabled)
- Manual links always override auto-linked results

---

## 6. UX & Product Principles

- Linking should feel:
  - Optional
  - Helpful
  - Non-disruptive
- Never force users to link
- Always allow users to control their post context

---

## 7. Non-goals (Out of Scope)

- Recommendation ranking logic
- AI-based semantic analysis
- Cross-language title resolution
- Moderation rules for references

---

## 8. Quality Bar

- No breaking changes to existing post APIs
- Clear visual distinction between:
  - Post content
  - Linked entities
- Performance-safe (no excessive joins or queries)

---

## 9. Future Extension Hooks (Not Implemented)

> The following ideas are **intentionally NOT included in this prompt**, but the design should allow them later:

- Spoiler-aware linking
- Anime/Manga topic auto-generation
- Character-level linking
- AI-assisted summary & tagging
- Community hubs per anime/manga

---

## Output Expectation

- Updated Post creation & detail flow
- Bi-directional navigation:
  - Post → Anime/Manga
  - Anime/Manga → Posts
- Clean architecture, extensible for Phase 3+

---

## Final Note

This feature is **core to Otaku Community’s differentiation**.
It transforms posts from isolated content into **context-rich Otaku discussions**.

Design for clarity first, intelligence second.
