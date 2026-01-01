# Task: Implement User Profile Page (Twitter-like)

You are a senior full-stack engineer.

Your task is to design and implement a **User Profile page** similar to **Twitter (X)** for a social media platform.

---

## 🎯 Objectives
- Display user personal information
- Show user-generated content (posts)
- Support follow / unfollow interactions
- Ensure scalability and clean architecture

---

## 👤 Profile Header
The profile page must include:

- Cover image (optional)
- Avatar
- Display name
- Username (handle)
- Bio (text, max 160 characters)
- Location (optional)
- Website link (optional)
- Joined date
- Follow / Unfollow button (only visible when viewing other users)

---

## 📊 Profile Stats
Display the following statistics:

- Number of posts
- Number of followers
- Number of following

Each stat should be clickable to navigate to:
- Followers list
- Following list

---

## 📝 Profile Tabs
Implement tab-based navigation:

1. **Posts**
   - All posts created by the user
   - Sorted by newest first
   - Supports pagination (cursor-based)

2. **Replies** (optional)
   - Posts where the user replied to others

3. **Media**
   - Posts that contain images or videos only

4. **Likes** (optional)
   - Posts liked by the user

---

## 🧩 Post Item Requirements
Each post should display:
- Author avatar and name
- Username
- Created time (relative, e.g. "2h ago")
- Post content (text)
- Media attachments (if any)
- Like count
- Reply count
- Repost count (optional)

---

## 🔐 Access Control
- Public profiles are viewable by everyone
- If the profile is private:
  - Only followers can see posts
  - Non-followers see a "This account is private" message

---

## ⚙️ Backend Requirements
- RESTful or GraphQL APIs
- Endpoints / queries:
  - Get user profile by username
  - Follow / Unfollow user
  - Get user posts with cursor-based pagination
  - Get followers / following list
- Proper indexing for performance

---

## 💾 Database Considerations
Suggested entities:
- User
- Post
- Follow (follower_id, following_id)
- PostLike
- Media

---

## 🎨 Frontend Requirements
- Responsive layout (desktop & mobile)
- Skeleton loading for profile and posts
- Optimistic UI for follow/unfollow actions
- Error and empty states

---

## 🧪 Edge Cases
- User not found
- User has no posts
- Viewing own profile (hide follow button)
- Blocked users (optional)

---

## 📦 Deliverables
- API design (routes or schema)
- Database schema (ERD or tables)
- Frontend component structure
- Brief explanation of architecture decisions

---

Please implement with clean, maintainable, and scalable code following best practices.
