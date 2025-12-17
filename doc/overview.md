# Project Overview

## Purpose
This document provides a high-level introduction to the Japan Community Social Platform - a web-based social network that combines topic-based communities (like Reddit) with social timeline features (like Facebook/Twitter), focused on Japanese culture, language, lifestyle, and entertainment.

## Project Goals
- Create a centralized platform for Japan enthusiasts to connect, share, and learn
- Support diverse content types including anime, manga, JLPT learning, travel, food, and culture
- Enable community-driven content discovery through topic-based organization
- Provide personalized feeds based on user interests and follows
- Foster engagement through social features (likes, comments, follows)
- Build a scalable foundation for future expansion into learning tools, events, and gamification

## Scope
Includes:
- User authentication and profile management
- Post creation with text and images
- Topic-based content organization and tagging
- Social interactions (likes, comments, follows)
- Personalized and topic-specific feeds
- Search functionality for users, posts, and topics
- Notification system for user interactions
- Content moderation and reporting tools
- Admin dashboard for platform management

Does not include (MVP):
- Direct messaging between users
- Video content support
- Advanced JLPT learning modules
- Event management system
- Gamification features (badges, XP, missions)
- Mobile native applications
- Real-time chat functionality
- Third-party API integrations (MyAnimeList, AniList)

## Stakeholders
- **End Users**: Japan enthusiasts, anime/manga fans, Japanese language learners, travelers
- **Content Creators**: Users who actively post and engage with the community
- **Moderators/Admins**: Platform administrators managing content and user behavior
- **Development Team**: Solo developer building and maintaining the platform

## Technology Stack
- **Backend**: Java Spring Boot
- **Database**: PostgreSQL with full-text search capabilities
- **ORM**: JPA
- **Frontend**: Next.js 14+ with TypeScript, TailwindCSS, shadcn/ui
- **Storage**: Cloudinary for image hosting
- **Authentication**: Auth0
- **State Management**: TanStack Query for server state
- **Validation**: Zod for form and API validation
- **Hosting**: Vercel (frontend), Railway/Render (backend), Neon (database) 
