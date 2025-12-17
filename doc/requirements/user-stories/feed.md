# Feed User Stories

## US-FEED-001: View Home Feed

### As a
Logged-in user

### I want to
See a personalized feed of posts from users and topics I follow

### So that
I can stay updated with content relevant to my interests

### Acceptance Criteria
**When** a user navigates to the home page after logging in:

**Then:**
- The system displays a feed of posts that includes:
  - Posts from users the current user follows
  - Posts from topics the current user follows
- Posts are sorted by recency (newest first)
- Each post card displays:
  - Author's avatar and username
  - Post content (truncated if long, with "Read more" link)
  - Images (if any)
  - Topics (as clickable tags)
  - Like count and Comment count
  - Like, Comment, and Share buttons
  - Timestamp (e.g., "2 hours ago")
- The feed uses infinite scroll or pagination (20 posts per page)
- If no followed users/topics:
  - The system displays a message: "Follow users and topics to see personalized content"
  - The system suggests popular topics to follow

---

## US-FEED-002: View Explore Feed

### As a
User (logged in or guest)

### I want to
Discover trending and recent content from the entire community

### So that
I can find interesting posts and new users to follow

### Acceptance Criteria
**When** a user clicks on the **Explore** tab or link:

**Then:**
- The system displays a feed of recent/trending posts from all users
- Posts are sorted by:
  - Recency (default)
  - Or engagement (likes + comments) for trending
- Each post card displays the same information as home feed
- The feed is accessible to both logged-in users and guests
- Guests can view posts but cannot like, comment, or follow
- The feed uses infinite scroll or pagination
- A filter/sort option allows switching between "Recent" and "Trending"

---

## US-FEED-003: View Topic Feed

### As a
User (logged in or guest)

### I want to
View posts filtered by a specific topic

### So that
I can focus on content about subjects I'm interested in

### Acceptance Criteria
**When** a user clicks on a topic tag or navigates to a topic page:

**Then:**
- The system displays a feed of posts tagged with that topic
- The page shows:
  - Topic name and description at the top
  - **Follow Topic** button (if logged in and not already following)
  - Post count for this topic
  - Feed of posts with this topic
- Posts are sorted by recency (newest first)
- Each post card displays standard post information
- The feed uses infinite scroll or pagination
- If logged in, the user can follow/unfollow the topic from this page

---

## US-FEED-004: Infinite Scroll

### As a
User browsing any feed

### I want to
Automatically load more posts as I scroll down

### So that
I can browse content seamlessly without clicking pagination buttons

### Acceptance Criteria
**When** a user scrolls to the bottom of the feed:

**Then:**
- The system automatically loads the next page of posts (20 more)
- A loading indicator is displayed while fetching
- New posts are appended to the existing feed
- The scroll position is maintained
- If no more posts are available:
  - The system displays "You've reached the end"
  - No more loading occurs

**Performance:**
- Loading should complete within 500ms
- Images should lazy load as they come into viewport
- The system should prefetch the next page when user is near the bottom

---

## US-FEED-005: Refresh Feed

### As a
User viewing any feed

### I want to
Refresh the feed to see new posts

### So that
I can see the latest content without reloading the page

### Acceptance Criteria
**When** a user pulls down on mobile or clicks a refresh button:

**Then:**
- The system fetches the latest posts
- A loading indicator is displayed
- New posts are added to the top of the feed
- A notification shows how many new posts were loaded (e.g., "5 new posts")
- The user's scroll position is maintained or smoothly scrolled to top
- The refresh completes within 1 second

---

## US-FEED-006: Empty Feed State

### As a
New user with no followed users or topics

### I want to
See helpful guidance when my feed is empty

### So that
I know what to do to populate my feed

### Acceptance Criteria
**When** a user's home feed has no posts:

**Then:**
- The system displays an empty state message:
  - Icon or illustration
  - Message: "Your feed is empty"
  - Subtext: "Follow users and topics to see posts here"
- The system shows suggestions:
  - **Suggested Topics** section with popular topics
  - **Suggested Users** section with active users
  - Each suggestion has a **Follow** button
- Clicking **Explore** button navigates to the explore feed
- Once the user follows users/topics, the feed populates on next refresh

---

## US-FEED-007: Post Interactions from Feed

### As a
Logged-in user viewing the feed

### I want to
Interact with posts directly from the feed

### So that
I can engage with content without navigating away

### Acceptance Criteria
**When** a user is viewing the feed:

**Then:**
- The user can click the **Like** button:
  - The like count increases immediately
  - The button changes to "Liked" state (filled heart)
  - The post author receives a notification
- The user can click the **Comment** button:
  - The system navigates to the post detail page
  - The comment input is focused
- The user can click the **Share** button:
  - The post link is copied to clipboard
  - A success message appears
- The user can click anywhere else on the post card:
  - The system navigates to the post detail page
- All interactions update in real-time without page reload

---

## US-FEED-008: Filter Feed by Sort Order

### As a
User viewing the explore feed

### I want to
Sort posts by different criteria

### So that
I can discover content in different ways

### Acceptance Criteria
**When** a user is on the explore feed:
- The system displays sort options:
  - **Recent** (default) - newest posts first
  - **Trending** - posts with most engagement in last 24 hours
  - **Top** - posts with most likes all-time (optional)

**Then:**
- Selecting a sort option reloads the feed with that sorting
- The selected option is visually highlighted
- The sort preference is remembered during the session
- Loading indicator shows while fetching sorted results

---

## US-FEED-009: View Post Preview

### As a
User viewing the feed

### I want to
See a preview of long posts

### So that
I can decide if I want to read the full content

### Acceptance Criteria
**When** a post has content longer than 300 characters:

**Then:**
- The system displays the first 300 characters
- An ellipsis (...) is shown at the truncation point
- A **Read more** link is displayed
- Clicking **Read more** navigates to the post detail page
- Images are always shown in full (not truncated)
- The preview maintains formatting (line breaks, etc.)
