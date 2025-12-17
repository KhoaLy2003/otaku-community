# Module Diagram

## Purpose
This document describes module boundaries and responsibilities for the Japan Community Social Platform backend.

## Module Architecture Overview

The backend follows a modular architecture where each module encapsulates related functionality with clear boundaries and responsibilities.

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│                  (Request/Response Handling)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼─────┐ ┌───────▼────────┐
│  Auth Module   │ │Middleware│ │  Guards Module │
│                │ │          │ │                │
└────────────────┘ └──────────┘ └────────────────┘
                         │
        ┌────────────────┼────────────────────────────┐
        │                │                            │
┌───────▼────────┐ ┌────▼─────────┐ ┌──────────▼─────────┐
│  User Module   │ │  Post Module │ │  Topic Module      │
└────────────────┘ └──────────────┘ └────────────────────┘
        │                │                            │
┌───────▼────────┐ ┌────▼─────────┐ ┌──────────▼─────────┐
│Comment Module  │ │  Like Module │ │Notification Module │
└────────────────┘ └──────────────┘ └────────────────────┘
        │                │                            │
        └────────────────┼────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  Admin Module   │
                └─────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼─────┐ ┌───────▼────────┐
│   Database     │ │Cloudinary│ │  Email Service │
│   (Prisma/JPA) │ │ Service  │ │   (Future)     │
└────────────────┘ └──────────┘ └────────────────┘
```

## Modules

### 1. Auth Module
**Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password hashing and verification
- Refresh token management
- Session handling

**Key Components:**
- `AuthController`: Handles authentication endpoints
- `AuthService`: Business logic for authentication
- `JwtStrategy`: JWT validation strategy
- `LocalStrategy`: Username/password validation

**Dependencies:**
- User Module (for user data)
- JWT library
- Bcrypt library

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

---

### 2. User Module
**Responsibilities:**
- User profile management
- User search and discovery
- Follow/unfollow functionality
- Avatar upload coordination
- User statistics calculation

**Key Components:**
- `UserController`: User-related endpoints
- `UserService`: User business logic
- `UserRepository`: Database operations
- `User` entity/model

**Dependencies:**
- Auth Module (for authentication)
- Cloudinary Service (for avatar uploads)
- Follow Module (for relationships)

**Endpoints:**
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/posts` - Get user's posts
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user
- `GET /api/users/search` - Search users

---

### 3. Post Module
**Responsibilities:**
- Post creation, editing, deletion
- Post retrieval and filtering
- Image upload coordination
- Full-text search
- Soft delete management

**Key Components:**
- `PostController`: Post endpoints
- `PostService`: Post business logic
- `PostRepository`: Database operations
- `Post` entity/model

**Dependencies:**
- User Module (for author info)
- Topic Module (for tagging)
- Like Module (for engagement)
- Comment Module (for engagement)
- Cloudinary Service (for images)

**Endpoints:**
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts` - List posts with filters
- `GET /api/posts/search` - Search posts

---

### 4. Topic Module
**Responsibilities:**
- Topic management (CRUD)
- Topic following
- Topic-based feed generation
- Topic search

**Key Components:**
- `TopicController`: Topic endpoints
- `TopicService`: Topic business logic
- `TopicRepository`: Database operations
- `Topic` entity/model

**Dependencies:**
- User Module (for following)
- Post Module (for content)

**Endpoints:**
- `GET /api/topics` - List all topics
- `GET /api/topics/:slug` - Get topic details
- `POST /api/topics` - Create topic (admin)
- `PUT /api/topics/:id` - Update topic (admin)
- `POST /api/topics/:id/follow` - Follow topic
- `DELETE /api/topics/:id/follow` - Unfollow topic
- `GET /api/topics/:slug/posts` - Get topic feed

---

### 5. Comment Module
**Responsibilities:**
- Comment creation and deletion
- Comment retrieval by post
- Comment editing
- Comment count aggregation

**Key Components:**
- `CommentController`: Comment endpoints
- `CommentService`: Comment business logic
- `CommentRepository`: Database operations
- `Comment` entity/model

**Dependencies:**
- User Module (for author info)
- Post Module (for parent post)
- Notification Module (for alerts)

**Endpoints:**
- `POST /api/posts/:postId/comments` - Create comment
- `GET /api/posts/:postId/comments` - Get comments
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

---

### 6. Like Module
**Responsibilities:**
- Like/unlike posts
- Like count aggregation
- User like status checking
- Duplicate prevention

**Key Components:**
- `LikeController`: Like endpoints
- `LikeService`: Like business logic
- `LikeRepository`: Database operations
- `Like` entity/model

**Dependencies:**
- User Module (for user info)
- Post Module (for post info)
- Notification Module (for alerts)

**Endpoints:**
- `POST /api/posts/:postId/like` - Like post
- `DELETE /api/posts/:postId/like` - Unlike post
- `GET /api/posts/:postId/likes` - Get likes count

---

### 7. Notification Module
**Responsibilities:**
- Notification creation on events
- Notification retrieval
- Read/unread status management
- Notification type handling

**Key Components:**
- `NotificationController`: Notification endpoints
- `NotificationService`: Notification business logic
- `NotificationRepository`: Database operations
- `Notification` entity/model

**Dependencies:**
- User Module (for recipients)
- Post Module (for context)
- Comment Module (for context)

**Endpoints:**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

---

### 8. Admin Module
**Responsibilities:**
- Content moderation
- User management (ban/unban)
- Report review and handling
- Audit log creation
- Platform statistics

**Key Components:**
- `AdminController`: Admin endpoints
- `AdminService`: Admin business logic
- `ReportRepository`: Report operations
- `AdminActionRepository`: Audit log operations

**Dependencies:**
- User Module (for user management)
- Post Module (for content moderation)
- All modules (for statistics)

**Endpoints:**
- `GET /api/admin/reports` - List reports
- `PUT /api/admin/reports/:id` - Update report status
- `DELETE /api/admin/posts/:id` - Delete post
- `PUT /api/admin/users/:id/ban` - Ban user
- `PUT /api/admin/users/:id/unban` - Unban user
- `GET /api/admin/stats` - Platform statistics

---

### 9. Feed Module
**Responsibilities:**
- Personalized feed generation
- Explore feed generation
- Topic feed generation
- Feed pagination and sorting

**Key Components:**
- `FeedController`: Feed endpoints
- `FeedService`: Feed business logic
- Complex queries across multiple modules

**Dependencies:**
- User Module (for followed users)
- Topic Module (for followed topics)
- Post Module (for content)
- Like Module (for engagement)
- Comment Module (for engagement)

**Endpoints:**
- `GET /api/feed/home` - Personalized home feed
- `GET /api/feed/explore` - Explore feed
- `GET /api/feed/following` - Posts from followed users

---

## Cross-Cutting Concerns

### Middleware
- **Authentication Middleware**: Validates JWT tokens
- **Logging Middleware**: Logs all requests
- **Error Handling Middleware**: Standardizes error responses
- **Rate Limiting Middleware**: Prevents abuse

### Guards
- **AuthGuard**: Ensures user is authenticated
- **RoleGuard**: Ensures user has required role
- **OwnershipGuard**: Ensures user owns resource

### Services (Shared)
- **Cloudinary Service**: Image upload and management
- **Email Service**: Email notifications (future)
- **Cache Service**: Redis caching (future)
- **Logger Service**: Centralized logging

## Data Flow Between Modules

### Example: Creating a Post with Topics
1. User sends request to `PostController`
2. `AuthGuard` validates JWT token
3. `PostController` calls `PostService.create()`
4. `PostService` validates input data
5. `PostService` calls `CloudinaryService` for images
6. `PostService` creates post in database
7. `PostService` calls `TopicService` to associate topics
8. `TopicService` creates post_topics relationships
9. `PostService` returns created post
10. `PostController` sends response to user

### Example: Liking a Post
1. User sends request to `LikeController`
2. `AuthGuard` validates JWT token
3. `LikeController` calls `LikeService.like()`
4. `LikeService` checks if already liked
5. `LikeService` creates like record
6. `LikeService` calls `NotificationService`
7. `NotificationService` creates notification for post author
8. `LikeService` returns success
9. `LikeController` sends response to user

## Module Communication Patterns

- **Direct Injection**: Modules inject services from other modules
- **Event-Driven**: Modules emit events for loose coupling (future)
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **DTO Pattern**: Data transfer between layers
