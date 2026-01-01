# AI Prompt – Implement Social & Profile Features

## Project Context

You are a **senior full-stack engineer** working on the **Otaku Community Project** – a social media platform similar to Twitter (X).

Tech stack:

- Backend: Spring Boot, JPA / Hibernate, REST APIs
- Frontend: SPA (React/Vue equivalent)
- Architecture: Clean architecture, soft delete, cursor-based pagination

All new features must:

- Follow existing coding standards
- Reuse current entities/services where possible
- Avoid breaking existing APIs

---

## 🎯 Objective

Implement the following features:

1. Update Button Navigation (Profile → My Post): [x]
2. Delete Post Confirmation Popup: [x]
3. Navigate to Author Profile from Avatar: [x]
4. Hide Post: [ ]
5. Save Post: [ ]
6. Search Post: [ ]
7. Recent Post: [ ]
8. Media Tab in Profile Page: [x]
9. Follow Feature: [x]
10. Change Avatar / Cover Feature: [ ]
11. Show followers/following list in profile page: [ ]
12. Vote/Unvote feature: [ ]

---

## ✅ Enhancement Checklist

### 1️⃣ Update Button Navigation (Profile → My Post)

**Description**

- When a user views **Post Detail** by clicking a post from:
  - Profile Page → **My Posts**
- Clicking **Update / Edit Post** should:
  - Navigate back to **My Post context**
  - ❌ NOT redirect to Feed page

**Acceptance Criteria**

- Update button preserves origin context
- After update success:
  - User is redirected back to **My Post detail or Profile page**
- Feed state must not be affected

**Status**

- [ ] Not Started
- [ ] In Progress
- [x] Done

---

### 2️⃣ Delete Post Confirmation Popup

**Description**

- When user clicks **Delete Post**, a confirmation popup must be shown

**Popup Requirements**

- Title: `Delete post?`
- Message: `This action cannot be undone.`
- Actions:
  - **Confirm** → Proceed to delete
  - **Cancel** → Close popup, no action

**Acceptance Criteria**

- Delete API is called **only after confirmation**
- Popup blocks background interaction
- Proper loading & error states handled

**Status**

- [ ] Not Started
- [ ] In Progress
- [x] Done

---

### 3️⃣ Navigate to Author Profile from Avatar

**Description**

- When hovering over the **author avatar** in a post:
  - Avatar is clickable
  - Clicking navigates to the author's profile page

**Navigation Behavior**

- Works consistently in:
  - Feed
  - Profile Page
  - Post Detail Page

**UX Requirements**

- Cursor changes to pointer on hover
- Optional hover effect (highlight / tooltip)

**Acceptance Criteria**

- Clicking avatar always navigates to correct profile
- No full page reload (SPA behavior)

**Status**

- [ ] Not Started
- [ ] In Progress
- [x] Done

---

## 4️⃣ Hide Post Feature

### Description

Allow users to **hide a post** so it no longer appears in their feed.

### Requirements

- Hidden posts:
  - Do NOT appear in user feed
  - Still exist in database
- Only affects the current user (personal preference)

### Suggested Design

- Create `hidden_posts` table:
  - user_id
  - post_id
  - created_at
- Feed query must exclude hidden posts for that user

### Acceptance Criteria

- Hidden post disappears from feed immediately
- Other users are NOT affected

---

## 5️⃣ Save Post Feature

### Description

Allow users to **save/bookmark posts** to view later.

### Requirements

- Toggle save / unsave
- Saved posts list available in profile or separate page

### Suggested Design

- `saved_posts` table:
  - user_id
  - post_id
  - created_at
- API:
  - Save post
  - Unsave post
  - Get saved posts (paginated)

### Acceptance Criteria

- Saved post persists across sessions
- User can view only their own saved posts

---

## 6️⃣ Search Post Feature

### Description

Enable searching posts by keyword.

### Search Scope

- Post content
- Author name / username (optional)
- Topic / hashtag (if supported)

### Requirements

- Case-insensitive
- Paginated results
- Exclude deleted posts

### Technical Notes

- Use DB full-text search or LIKE-based search
- Index `posts.content` for performance

### Acceptance Criteria

- Relevant posts returned
- Fast response with large dataset

---

## 7️⃣ Recent Post Feature

### Description

Display **recent posts** across the platform.

### Logic

- Fetch **top 5 latest posts**
- Sorted by:
  - `createdAt DESC`
- Exclude:
  - Deleted posts
  - Hidden posts (for the current user)

### Usage

- Home page
- Explore section

### Acceptance Criteria

- Always returns at most 5 posts
- Posts are the newest ones at query time

---

## 8️⃣ Media Tab in Profile Page

### Description

Add a **Media** tab to user profile showing all media the user has uploaded.

### Display Logic

- Show **all media files** uploaded by the user:
  - Images
  - Videos
- Media is NOT grouped by post in the UI grid

### Interaction

- When user clicks a specific media item:
  - Open a **Post Detail popup**
  - Display the post that contains this media

### Backend Logic

- Query media by:
  - `media.uploaderId = userId`
- Join with post for popup detail

### Pagination

- Use **cursor-based pagination**
- Sorted by:
  - `media.createdAt DESC`

### Acceptance Criteria

- Media tab loads smoothly with pagination
- Clicking media always opens correct post detail
- Matches Twitter-like Media tab behavior

---

## 9️⃣ Follow Feature

### Description

Allow users to **follow / unfollow** other users.

### Requirements

- Follow button on profile page
- Cannot follow yourself
- Toggle follow/unfollow

### Suggested Design

- `follows` table:
  - follower_id
  - following_id
  - created_at

### Side Effects

- Update follower / following count
- Feed may include posts from followed users

### Acceptance Criteria

- Follow state updates instantly (optimistic UI)
- Counts are accurate

---

## 🔟 Change Avatar / Cover Feature

### Description

Allow users to update:

- Avatar image
- Cover image

### Requirements

- Upload image to media storage (Cloudinary or equivalent)
- Validate:
  - File type
  - File size
- Replace old image safely

### Backend Flow

1. Upload image
2. Update user profile
3. Return updated profile info

### Acceptance Criteria

- Image updates immediately
- Old image is no longer used
- Proper error handling

---

## 🧪 General Testing Checklist

- [ ] Update flow works from Profile → My Post
- [ ] Delete confirmation popup appears correctly
- [ ] Unauthorized users cannot update/delete posts
- [ ] Avatar navigation works across all post lists
- [ ] No regression in Feed behavior

---

## 1️⃣1️⃣ Show Followers / Following List in Profile Page

### Description

Display **Followers** and **Following** lists on the user profile page.

### UI Behavior

- Profile stats include:
  - Followers count
  - Following count
- Clicking each stat navigates to:
  - Followers list
  - Following list

### List Behavior

- Show user items with:
  - Avatar
  - Display name
  - Username
  - Follow / Unfollow button (if applicable)

### Backend Logic

- Query users via `follows` table:
  - Followers: `following_id = profileUserId`
  - Following: `follower_id = profileUserId`
- Exclude blocked or deleted users (if applicable)

### Pagination

- Use **cursor-based pagination**
- Sort by:
  - `follows.createdAt DESC`

### Acceptance Criteria

- Lists load correctly with pagination
- Follow/unfollow works directly from the list
- Counts match actual data

---

## 1️⃣2️⃣ Vote / Unvote Feature

### Description

Allow users to **vote (upvote)** and **unvote** a post.

### Behavior

- Vote is **binary** (no downvote)
- Toggle behavior:
  - Vote → Unvote
  - Unvote → Vote

### UI Rules

- Vote button shows:
  - Active state if user has voted
  - Vote count
- Optimistic UI update required

### Backend Logic

- Create `post_votes` table:
  - post_id
  - user_id
  - created_at
- Enforce:
  - One vote per user per post

### Data Consistency

- Maintain:
  - `posts.vote_count` (denormalized) OR
  - Count dynamically from `post_votes`

### Validation & Security

- User must be authenticated
- Cannot vote own post (optional rule)
- Prevent duplicate votes

### Acceptance Criteria

- Vote count updates correctly
- Refreshing page preserves vote state
- API rejects invalid or duplicate actions

---

## 📝 Notes

- Keep behavior consistent with Twitter / Facebook UX
- Ensure clean separation between Feed and Profile navigation states
- Follow existing routing & permission patterns

---

**End of Checklist**
