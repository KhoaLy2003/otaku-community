# 🔹 Prompt: Redis Integration for Otaku Community Backend

## 1. Context

You are working on **Otaku Community** , a social media platform focused on anime & manga content.
The system already includes core features such as:

- Authentication & Authorization
- Post & Feed
- Notification
- Chat
- Anime / Manga data integrated from **Jikan API**
- Internal database for users, posts, and related domain data

The goal of this task is to **integrate Redis** to improve **performance, scalability, and user experience** , especially under high read traffic.

---

## 2. Objectives

Design and integrate Redis into the backend system with the following objectives:

- Reduce response time for read-heavy APIs
- Minimize unnecessary calls to third-party APIs (Jikan)
- Improve feed loading performance
- Support scalable real-time or near-real-time features
- Prepare the system for future growth

---

## 3. Redis Usage Scenarios (Scope)

### 3.1 Caching Layer (Primary Focus – MVP)

Redis will be used as a **cache** , not as the primary data store.

Target data to cache:

#### 🔹 Third-party API Data (High Priority)

- Anime list (Top Anime, Seasonal Anime)
- Anime detail
- Manga list (Top Manga)
- Manga detail
- Search results (Anime / Manga)

#### 🔹 Internal Read-heavy Data

- Public user profile
- User custom profile settings
- Post detail
- Post list (Feed, Profile posts)
- Related posts for Anime / Manga detail page

---

### 3.2 Performance Optimization

Redis should help to:

- Reduce database load
- Reduce latency on repeated requests
- Improve Time-To-First-Byte (TTFB) for feed and detail pages

---

### 3.3 Optional / Future Use Cases (Not MVP)

These ideas should be considered but **not implemented in this phase** :

- Rate limiting (per user / per IP)
- Notification unread counters
- Chat online status
- Distributed locking
- Trending score calculation (posts / anime / manga)

---

## 4. High-Level Architecture

### 4.1 Position in System Architecture

```
Client
  ↓
API Gateway / Controller
  ↓
Service Layer
  ↓
Redis Cache (Read-first)
  ↓
Database / Third-party API (Fallback)
```

---

### 4.2 Cache Strategy

- **Cache-aside pattern**
- Backend checks Redis first
- If cache miss:
  - Fetch from DB or Jikan API
  - Map to internal DTO
  - Store in Redis
  - Return response

---

## 5. Cache Design

### 5.1 Cache Key Design

Keys should be:

- Predictable
- Namespaced
- Versionable (future-proof)

**Examples:**

```
anime:top:page:{page}
anime:season:{year}:{season}:page:{page}
anime:detail:{animeId}

manga:top:page:{page}
manga:detail:{mangaId}

post:detail:{postId}
post:feed:user:{userId}:page:{page}

profile:user:{userId}
```

---

### 5.2 TTL Strategy

| Data Type            | Suggested TTL   |
| -------------------- | --------------- |
| Anime / Manga list   | 6 – 12 hours    |
| Anime / Manga detail | 12 – 24 hours   |
| Search result        | 30 – 60 minutes |
| Post detail          | 10 – 30 minutes |
| Feed                 | 1 – 5 minutes   |
| User profile         | 10 – 30 minutes |

TTL values should be **configurable via environment variables** .

---

### 5.3 Serialization Format

- Use **JSON** for cached values
- Store **already-mapped internal DTO** , not raw external response
- Ensure compatibility with API response contracts

---

## 6. Cache Invalidation Strategy

### 6.1 Time-based Invalidation (Primary)

- Rely on TTL for most data
- Especially suitable for:
  - Anime / Manga data
  - Public feeds

---

### 6.2 Event-based Invalidation (Selective)

When internal data changes:

| Action              | Cache Invalidation       |
| ------------------- | ------------------------ |
| Update post         | `post:detail:{id}`       |
| Delete post         | `post:*`related keys     |
| Update user profile | `profile:user:{id}`      |
| New post created    | Feed cache (user/global) |

Event-based invalidation should be triggered in the **service layer** , not controller.

---

## 7. Backend Implementation Phases

### Phase 1 – Basic Redis Integration

- Add Redis dependency
- Configure Redis connection
- Health check / connection test
- Basic get / set utility

---

### Phase 2 – Cache Third-party API Data

- Cache Anime APIs (Top, Seasonal, Detail)
- Cache Manga APIs (Top, Detail)
- Implement cache-aside logic
- Add TTL configuration

---

### Phase 3 – Cache Internal Data

- Cache post detail
- Cache feed responses
- Cache public user profile
- Add invalidation logic

---

### Phase 4 – Monitoring & Optimization

- Log cache hit / miss
- Measure performance improvement
- Fine-tune TTL values

---

## 8. Non-Functional Requirements

- Redis failure must **not break** the system
- On Redis error → fallback to DB / Jikan API
- Cache logic must be **transparent to client**
- Avoid cache stampede (basic locking or short TTLs if needed)
- Clear separation between:
  - Cache logic
  - Business logic

---

## 9. Deliverables

- Redis integration design
- Cache key naming conventions
- TTL configuration strategy
- Cache usage documented per API
- Clean, maintainable cache abstraction

---

## 10. Out of Scope

- Redis Cluster setup
- Redis Sentinel
- Advanced pub/sub
- Real-time streaming
- Distributed transactions

---

## 11. Success Criteria

- Reduced response time for Anime / Manga APIs
- Reduced number of calls to Jikan API
- Improved feed loading performance
- Clear, maintainable caching strategy
- Easy extension for future Redis-based features
