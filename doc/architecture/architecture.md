# System Architecture

## High-Level Architecture

The Japan Community Social Platform follows a modern three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js 14+ with TypeScript, TailwindCSS, shadcn/ui)     │
│                                                              │
│  - Server-Side Rendering (SSR)                              │
│  - Client-Side Routing                                      │
│  - State Management (TanStack Query)                        │
│  - Form Validation (Zod)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Application Layer                         │
│         (NestJS/Spring Boot with TypeScript/Java)           │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Auth     │  │   Posts    │  │   Users    │           │
│  │  Module    │  │   Module   │  │   Module   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Topics    │  │  Notifs    │  │   Admin    │           │
│  │  Module    │  │   Module   │  │   Module   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  - JWT Authentication                                        │
│  - Business Logic                                           │
│  - Data Validation                                          │
│  - API Endpoints                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│  PostgreSQL  │ │Cloudinary│ │   Redis    │
│   Database   │ │  (Images)│ │  (Cache)   │
│              │ │          │ │ (Optional) │
└──────────────┘ └──────────┘ └────────────┘
```

## Flow

### 1. User Authentication Flow
1. User submits credentials via login form
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials against database
4. Backend generates JWT access token (1h) and refresh token (7d)
5. Tokens are returned to frontend and stored securely
6. Subsequent requests include access token in Authorization header
7. Backend middleware validates token on protected routes

### 2. Post Creation Flow
1. User creates post with text and optional images
2. If images present, frontend uploads to Cloudinary first
3. Frontend receives image URLs from Cloudinary
4. Frontend sends POST request to `/api/posts` with content and image URLs
5. Backend validates request and user authentication
6. Backend creates post record in database with user_id
7. Backend creates post_topics associations
8. Backend returns created post with full details
9. Frontend updates UI and invalidates feed cache

### 3. Feed Generation Flow
1. User navigates to home feed
2. Frontend sends GET request to `/api/feed/home?page=1&limit=20`
3. Backend queries posts from followed users and topics
4. Backend joins with users, topics, likes, and comments tables
5. Backend calculates engagement metrics (likes count, comments count)
6. Backend checks if current user has liked each post
7. Backend returns paginated posts with full details
8. Frontend renders posts and enables infinite scroll

### 4. Notification Flow
1. User A likes User B's post
2. Backend creates like record in database
3. Backend triggers notification creation for User B
4. Notification record includes type, from_user_id, post_id
5. When User B loads app, frontend fetches unread notifications
6. Frontend displays notification badge with count
7. User B clicks notification, marks as read, navigates to post

## Key Modules

### Authentication Module
- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- Refresh token rotation
- Session management

### User Module
- User profile CRUD operations
- Avatar upload integration
- Follow/unfollow functionality
- User search
- Profile statistics calculation

### Post Module
- Post creation, editing, deletion
- Image upload coordination
- Post retrieval with filters
- Soft delete implementation
- Full-text search

### Topic Module
- Topic management (CRUD)
- Topic following
- Topic-based feed generation
- Topic search and discovery

### Comment Module
- Comment creation and deletion
- Comment retrieval by post
- Comment count aggregation
- Nested replies (future)

### Like Module
- Like/unlike posts
- Like count aggregation
- User like status checking
- Duplicate prevention

### Notification Module
- Notification creation on events
- Notification retrieval
- Read/unread status management
- Notification type handling

### Admin Module
- Content moderation
- User management (ban/unban)
- Report review
- Audit log creation
- Platform statistics

## Data Flow Diagram

### Post Interaction Data Flow
```
User Action → Frontend Validation → API Request → Backend Validation
     ↓
JWT Verification → Business Logic → Database Transaction
     ↓
Database Update → Notification Trigger → Response Generation
     ↓
Frontend Update → Cache Invalidation → UI Refresh
```

### Feed Loading Data Flow
```
Page Load → Check Auth → Request Feed Data
     ↓
Backend Query (Joins: posts + users + topics + likes + comments)
     ↓
Apply Filters (followed users/topics, not deleted)
     ↓
Calculate Metrics → Check User Interactions → Paginate Results
     ↓
Return JSON → Frontend Cache → Render UI
```

## Technology Decisions

### Why Next.js?
- Server-side rendering for better SEO
- Built-in routing and API routes
- Excellent developer experience
- Strong TypeScript support
- Optimized image handling

### Why NestJS/Spring Boot?
- Modular architecture for scalability
- Built-in dependency injection
- Strong typing with TypeScript/Java
- Extensive ecosystem
- Enterprise-grade reliability

### Why PostgreSQL?
- Robust relational data model
- Full-text search capabilities
- ACID compliance
- Excellent performance with proper indexing
- JSON support for flexible data

### Why Cloudinary?
- Easy integration
- Automatic image optimization
- CDN distribution
- Transformation capabilities
- Free tier suitable for MVP

## Security Architecture

### Authentication Layer
- JWT-based stateless authentication
- Refresh token rotation
- Token expiration handling
- Secure password hashing (bcrypt)

### Authorization Layer
- Role-based access control (User, Admin)
- Resource ownership validation
- Endpoint-level guards
- Action-level permissions

### Data Protection
- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS prevention (output encoding)
- CSRF protection
- Rate limiting

## Deployment Architecture

### Production Environment
```
┌──────────────┐
│   Vercel     │  ← Frontend (Next.js)
│   (CDN)      │
└──────┬───────┘
       │
┌──────▼───────┐
│  Railway/    │  ← Backend (NestJS/Spring Boot)
│   Render     │
└──────┬───────┘
       │
┌──────▼───────┐
│ Supabase/    │  ← PostgreSQL Database
│   Neon       │
└──────────────┘

┌──────────────┐
│  Cloudinary  │  ← Image Storage & CDN
└──────────────┘
```

### Scaling Strategy
- Frontend: Automatic scaling via Vercel CDN
- Backend: Horizontal scaling with load balancer
- Database: Connection pooling, read replicas (future)
- Images: CDN distribution globally
- Cache: Redis for session and feed caching (future)
