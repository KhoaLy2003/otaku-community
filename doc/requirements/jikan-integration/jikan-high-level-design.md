# 📘 Jikan API Integration – High-level Design Document (Overview)

## Purpose of This Document

This document provides a **conceptual overview** of how Otaku Community integrates with the **Jikan API**:

- What Jikan APIs are used (at a functional level)
- How internal domain models are designed and mapped
- High-level client–server architecture for the integration

⚠️ This is **NOT** an implementation or low-level technical spec.

---

## 1. Jikan API Overview (Used Scope Only)

### 1.1 About Jikan

- Jikan is an **unofficial, read-only REST API** for MyAnimeList data
- No authentication required
- Rate-limited → caching is mandatory
- Data is public and community-maintained

---

### 1.2 API Categories Used in MVP

#### 1️⃣ Anime APIs

**Purpose:** Core anime knowledge source

| Use Case            | Endpoint                     |
| ------------------- | ---------------------------- |
| List / search anime | `GET /anime`                 |
| Anime detail        | `GET /anime/{id}`            |
| Top anime           | `GET /top/anime`             |
| Seasonal anime      | `GET /seasons/now`           |
| Anime news          | `GET /anime/{id}/news`       |
| Anime characters    | `GET /anime/{id}/characters` |

---

#### 2️⃣ Manga APIs (Basic)

**Purpose:** Support manga-related content

| Use Case     | Endpoint          |
| ------------ | ----------------- |
| Search manga | `GET /manga`      |
| Manga detail | `GET /manga/{id}` |

---

#### 3️⃣ Character APIs (Read-only, limited)

**Purpose:** Prepare for future character-based features

| Use Case         | Endpoint               |
| ---------------- | ---------------------- |
| Character detail | `GET /characters/{id}` |

---

### 1.3 API Usage Principles

- Read-only
- No user-specific data
- No write-back to MyAnimeList
- External schema must NOT leak into internal domain

---

## 2. Internal Domain Model Design

### 2.1 Design Philosophy

- Jikan = **external data provider**
- Internal models represent **Otaku Community concepts**
- External data is treated as:
  - Reference
  - Snapshot
  - Cacheable resource

---

### 2.2 Core Internal Models (Conceptual)

#### Anime (Internal Snapshot Model)

Anime

- id (internal UUID)
- externalSource: "JIKAN"
- externalId (MAL anime ID)
- title
- imageUrl
- synopsis
- type (TV, Movie, OVA, ...)
- status (Airing, Finished)
- score
- season
- lastSyncedAt

#### Manga (Internal Snapshot Model)

Manga

- id
- externalSource
- externalId
- title
- imageUrl
- synopsis
- chapters
- status
- score
- lastSyncedAt

#### Character (Light Snapshot)

Character

- id
- externalSource
- externalId
- name
- imageUrl
- about

---

### 2.3 Why Snapshot Models?

- Avoid dependency on live external API
- Improve performance
- Ensure historical consistency (posts don’t break if API changes)
- Allow future enrichment (e.g. internal popularity score)

---

## 3. Mapping Strategy (External → Internal)

### 3.1 Mapping Principles

- One-way mapping: **Jikan → Internal**
- Mapping happens in a dedicated layer
- Only **necessary fields** are stored

---

### 3.2 Mapping Flow (Conceptual)

Jikan API Response
↓
API Adapter / Client
↓
DTO (External Schema)
↓
Mapper
↓
Internal Domain Snapshot

---

### 3.3 Mapping Rules

- External ID is stored but not used as primary key
- Text fields may be sanitized or shortened
- Images stored as URLs (no re-hosting in MVP)
- Lists (genres, studios) may be flattened initially

---

## 4. Client–Server Architecture

### 4.1 High-level Architecture

Frontend (Web / Mobile)
        ↓
Otaku Community Backend API
        ↓
-----------------------------
|  Integration Layer        |
|  - Jikan API Client       |
|  - Mapper                 |
|  - Cache Manager (Redis)  |
-----------------------------
        ↓
Jikan Public API


### 4.2 Backend Responsibilities

- Abstract all Jikan API usage
- Apply caching & rate-limit protection
- Convert external data to internal format
- Expose **stable internal APIs** to frontend

Frontend never calls Jikan directly.

---

### 4.3 Redis Caching Role

- Cache anime/manga detail responses
- Cache trending & seasonal lists
- TTL-based strategy (e.g. 6–24 hours)
- Cache key based on:

  - External ID
  - API type (detail, list, search)

---

## 5. Integration with Existing Features

### 5.1 Post Integration

- Post references:

  - `animeId` or `mangaId` (internal ID)

- Backend resolves snapshot data
- Frontend displays preview card:

  - Title
  - Image
  - Type

---

### 5.2 Feed & Discovery

- Trending anime surfaced in feed
- News auto-injected into discovery sections
- External data acts as **context**, not content replacement

---

## 6. Error Handling & Resilience (Conceptual)

- If Jikan API is down:

  - Serve cached data if available
  - Graceful degradation (no hard failure)

- Sync failures should not affect core social features
- Log external API errors separately (system logging)

---

## 7. Security & Compliance Notes

- No user data shared with Jikan
- Respect Jikan rate limits
- Follow attribution requirements if displayed

---

## 8. What This Enables Later (Not MVP)

- Watch / Read status tracking
- Character follow system
- Recommendation engine
- Community auto-generation per anime
- AI-powered summaries & analysis

---

## 9. Summary

**In Phase 2, Jikan acts as a “knowledge backbone”, not a dependency.**

- External API → Internal snapshot
- Strong decoupling
- Cache-first mindset
- Designed for growth without lock-in

---