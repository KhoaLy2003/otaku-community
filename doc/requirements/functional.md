# Functional Requirements

## Overview
This document defines what the system must do from a functional perspective for the Japan Community Social Platform MVP.

---

## User Roles
- **Guest**: Unauthenticated users who can view public content
- **Registered User**: Authenticated users who can create content, interact, and customize their experience
- **Admin/Moderator**: Users with elevated privileges to manage content, users, and platform settings

---

## Core Functional Requirements

### 1. User Management & Authentication
- Users must be able to register with email and password
- Users must be able to log in with email and password
- Users must be able to log out
- Users must be able to update their profile (username, avatar, bio, interests, location)
- Users must be able to upload and update profile avatars
- System must hash passwords using bcrypt
- System must issue JWT tokens for authentication
- System must support refresh tokens for session management
- Users must be able to view other user profiles
- Users must be able to see follower/following counts on profiles

### 2. Post Management
- Users must be able to create text posts
- Users must be able to create posts with images (single or multiple)
- Users must be able to tag posts with one or more topics
- Users must be able to edit their own posts
- Users must be able to delete their own posts
- System must support soft deletion of posts
- Posts must display author information, timestamp, and engagement metrics
- Posts must be paginated in feeds (default 20 per page)

### 3. Topic System
- System must provide predefined topics (Anime, Manga, JLPT Learning, Japan Culture, Japan Food, Japan Travel, Japanese Life & Work)
- Admins must be able to create new topics
- Admins must be able to edit topic names and descriptions
- Topics must have unique slugs for URL-friendly routing
- Users must be able to follow topics
- Users must be able to view topic-specific feeds
- Posts can be associated with multiple topics

### 4. Social Interactions
- Users must be able to like posts
- Users must be able to unlike posts
- Users must be able to comment on posts
- Users must be able to edit their own comments
- Users must be able to delete their own comments
- System must track and display like counts on posts
- System must track and display comment counts on posts
- Users must be able to follow other users
- Users must be able to unfollow users
- System must prevent duplicate likes and follows

### 5. Feed System
- Users must see a personalized home feed with posts from followed users and topics
- Users must be able to view an explore feed with trending/recent content
- Users must be able to view topic-specific feeds
- Users must be able to view user-specific feeds (profile pages)
- Feeds must be sorted by recency (newest first)
- Feeds must support infinite scroll/pagination
- System must exclude soft-deleted content from feeds

### 6. Search Functionality
- Users must be able to search for posts by keywords
- Users must be able to search for users by username
- Users must be able to search for topics by name
- Search must use PostgreSQL full-text search
- Search results must be paginated
- Search must exclude soft-deleted content

### 7. Notification System
- System must create notifications when a user's post is liked
- System must create notifications when a user's post is commented on
- System must create notifications when a user is followed
- Users must be able to view their notifications
- Users must be able to mark notifications as read
- Notifications must include relevant context (who, what, when)
- Unread notifications must be visually distinguished

### 8. Content Moderation
- Users must be able to report inappropriate posts
- Reports must include a reason field
- Admins must be able to view all reports
- Admins must be able to review reports and change status (pending, reviewed, dismissed)
- Admins must be able to delete posts
- Admins must be able to ban users (soft delete)
- System must log all admin actions for audit purposes
- Banned users must not be able to log in

### 9. Image Management
- System must support image uploads via Cloudinary
- Images must be validated for type (JPEG, PNG, GIF, WebP)
- Images must be validated for size (max 5MB per image)
- System must generate optimized image URLs
- System must handle image upload failures gracefully

### 10. User Profile Features
- Profiles must display user information (username, avatar, bio, interests, location)
- Profiles must display user statistics (followers, following, post count)
- Profiles must display user's posts in chronological order
- Profiles must show follow/unfollow button for other users
- Users must be able to view their own profile with edit capabilities

---

