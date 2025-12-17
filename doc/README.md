# Japan Community Social Platform - Documentation

## Overview
This directory contains comprehensive documentation for the Japan Community Social Platform, a web-based social network focused on Japanese culture, language, lifestyle, and entertainment.

## Documentation Structure

### 📋 Project Overview
- **[overview.md](overview.md)** - High-level project introduction, goals, scope, stakeholders, and technology stack

### 📝 Requirements
- **[requirements/functional.md](requirements/functional.md)** - Detailed functional requirements including user roles and core features
- **[requirements/non-functional.md](requirements/non-functional.md)** - Performance, security, reliability, scalability, and other non-functional requirements

### 🏗️ Architecture
- **[architecture/architecture.md](architecture/architecture.md)** - System architecture, data flow diagrams, and technology decisions
- **[architecture/module-diagram.md](architecture/module-diagram.md)** - Backend module structure, responsibilities, and communication patterns
- **[architecture/db-schema.md](architecture/db-schema.md)** - Complete database schema with tables, relationships, and indexes

### 🔌 API Documentation
- **[api/auth.md](api/auth.md)** - Authentication endpoints (register, login, refresh token, logout)
- **[api/user.md](api/user.md)** - User management endpoints (profile, follow, search)
- **[api/post.md](api/post.md)** - Post management endpoints (create, read, update, delete, like)
- **[api/topic.md](api/topic.md)** - Topic management endpoints (list, follow, admin operations)
- **[api/feed.md](api/feed.md)** - Feed endpoints (home, explore, topic feeds, user feeds)
- **[api/notification.md](api/notification.md)** - Notification endpoints (list, read, delete)

### 📊 Data Models
- **[models/user.md](models/user.md)** - User model attributes, validation, relationships, and business rules
- **[models/post.md](models/post.md)** - Post model attributes, validation, relationships, and business rules
- **[models/comment.md](models/comment.md)** - Comment model attributes, validation, relationships, and business rules
- **[models/topic.md](models/topic.md)** - Topic model attributes, validation, relationships, and predefined topics

### 📖 User Stories
- **[requirements/user-stories/auth.md](requirements/user-stories/auth.md)** - Authentication user stories (registration, login, logout, session management)
- **[requirements/user-stories/user-profile.md](requirements/user-stories/user-profile.md)** - User profile user stories (view, edit, follow, avatar upload)
- **[requirements/user-stories/post.md](requirements/user-stories/post.md)** - Post user stories (create, comment, share, detail view)
- **[requirements/user-stories/feed.md](requirements/user-stories/feed.md)** - Feed user stories (home feed, explore, topic feeds, interactions)

### ⚙️ Setup & Deployment
- **[setup.md](setup.md)** - Complete development environment setup guide with troubleshooting

## Quick Start

### For Developers
1. Read [overview.md](overview.md) to understand the project
2. Review [requirements/functional.md](requirements/functional.md) for feature details
3. Follow [setup.md](setup.md) to set up your development environment
4. Refer to [architecture/architecture.md](architecture/architecture.md) for system design
5. Use API documentation in [api/](api/) folder for endpoint details

### For Product Managers
1. Start with [overview.md](overview.md) for project goals and scope
2. Review [requirements/functional.md](requirements/functional.md) for feature specifications
3. Check [requirements/non-functional.md](requirements/non-functional.md) for quality attributes

### For Architects
1. Review [architecture/architecture.md](architecture/architecture.md) for system design
2. Study [architecture/module-diagram.md](architecture/module-diagram.md) for module structure
3. Examine [architecture/db-schema.md](architecture/db-schema.md) for data model

## Key Features (MVP)

### User Management
- Email/password authentication with JWT
- User profiles with avatar, bio, interests, location
- Follow/unfollow system
- User search

### Content Management
- Text and image posts (up to 4 images)
- Topic-based organization (Anime, Manga, JLPT, Culture, Food, Travel, Life & Work)
- Post editing and deletion (soft delete)
- Full-text search

### Social Features
- Like/unlike posts
- Comments on posts
- Personalized home feed
- Topic-specific feeds
- Explore feed

### Moderation
- Report inappropriate content
- Admin dashboard
- User banning
- Content deletion
- Audit logging

### Notifications
- Like notifications
- Comment notifications
- Follow notifications
- Read/unread status

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** TanStack Query
- **Validation:** Zod
- **Hosting:** Vercel

### Backend
- **Framework:** Spring Boot (Java)
- **Database:** PostgreSQL 14+
- **Authentication:** JWT with refresh tokens
- **Image Storage:** Cloudinary
- **Hosting:** Railway or Render

### Database
- **Primary:** PostgreSQL with full-text search
- **Features:** UUID primary keys, soft deletes, timestamps, indexes

## Development Phases

### Phase 1: Core Backend (Week 1)
- Database setup
- Authentication system
- Basic CRUD operations

### Phase 2: User Profiles (Week 2)
- Profile management
- Avatar uploads
- JWT implementation

### Phase 3: Posts (Week 3)
- Post creation with images
- Topic tagging
- Feed generation

### Phase 4: Interactions (Week 4)
- Likes and comments
- Social engagement

### Phase 5: Social Features (Week 5)
- Follow system
- Personalized feeds

### Phase 6: Discovery (Week 6)
- Search functionality
- Explore feed

### Phase 7: Moderation (Week 7)
- Notifications
- Reporting
- Admin tools

### Phase 8: Polish & Deploy (Week 8)
- Bug fixes
- Performance optimization
- Production deployment

## API Base URLs

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`

### Production
- Frontend: `https://your-domain.vercel.app`
- Backend: `https://your-api-domain.com/api`

## Contributing

When updating documentation:
1. Keep language clear and concise
2. Include code examples where appropriate
3. Update related documents when making changes
4. Follow the existing structure and format
5. Add diagrams using Mermaid syntax when helpful

## Additional Resources

- 

## Support

For questions or issues:
1. Check the relevant documentation section
2. Review the setup guide troubleshooting section
3. Consult the API documentation for endpoint details
4. Review the architecture documentation for system design questions

---

**Last Updated:** December 2024
**Version:** 1.0.0 (MVP)
**Status:** In Development
