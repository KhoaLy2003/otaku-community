# User Profile User Stories

## US-PROFILE-001: View Own Profile

### As a

Logged-in user

### I want to

View my own profile

### So that

I can see how my profile appears to others and access my content

### Acceptance Criteria

**When** a user clicks on their avatar or username in the navigation:

**Then:**

- The system navigates to the user's profile page
- The profile displays:
  - Avatar image
  - Username
  - Bio
  - Interests (as tags/chips)
  - Location
  - Join date
  - Statistics: Followers count, Following count, Posts count
  - **Edit Profile** button
  - List of user's posts (most recent first)
- The user can click **Edit Profile** to modify their information

---

## US-PROFILE-002: Edit Profile

### As a

Logged-in user

### I want to

Update my profile information

### So that

I can keep my profile current and express my interests

### Acceptance Criteria

**When** a user clicks the **Edit Profile** button:

- The system displays an edit form with current values:
  - Username (editable)
  - Bio (editable, max 500 characters)
  - Interests (multi-select, max 10)
  - Location (editable, max 100 characters)
  - Avatar (upload button)
- The user modifies any fields
- The user clicks **Save Changes**

**Then:**

- The system validates the input:
  - Username is unique and meets requirements
  - Bio doesn't exceed character limit
  - Interests don't exceed maximum
- If validation passes:
  - The system updates the profile
  - The system displays "Profile updated successfully"
  - The system returns to the profile view
- If validation fails:
  - The system displays specific error messages
  - The user remains in edit mode

---

## US-PROFILE-003: Upload Avatar

### As a

Logged-in user

### I want to

Upload a profile picture

### So that

I can personalize my account and be recognizable to others

### Acceptance Criteria

**When** a user clicks the **Change Avatar** button in edit profile:

- The system opens a file picker
- The user selects an image file (JPEG, PNG, GIF, WebP)
- The file size is under 5MB

**Then:**

- The system displays a preview of the selected image
- The system shows a crop/adjust tool (optional)
- The user clicks **Upload**
- The system uploads the image to Cloudinary
- The system updates the user's avatar URL
- The new avatar appears immediately on the profile
- A success message is displayed

**Error Cases:**

- If file is too large: "Image must be under 5MB"
- If file type is invalid: "Please upload a valid image file"
- If upload fails: "Upload failed, please try again"

---

## US-PROFILE-004: View Other User's Profile

### As a

User (logged in or guest)

### I want to

View another user's profile

### So that

I can learn about them and see their content

### Acceptance Criteria

**When** a user clicks on another user's username or avatar:

**Then:**

- The system navigates to that user's profile page
- The profile displays:
  - Avatar image
  - Username
  - Bio
  - Interests
  - Location
  - Join date
  - Statistics: Followers count, Following count, Posts count
  - **Follow/Unfollow** button (if logged in and not own profile)
  - List of user's posts (most recent first)
- If viewing as guest:
  - No Follow button is shown
  - A prompt to "Log in to follow" may appear
- If viewing own profile:
  - **Edit Profile** button is shown instead of Follow button

---

## US-PROFILE-005: Follow User

### As a

Logged-in user

### I want to

Follow other users

### So that

I can see their posts in my personalized feed

### Acceptance Criteria

**When** a user views another user's profile:

- The system displays a **Follow** button
- The user clicks the **Follow** button

**Then:**

- The system creates a follow relationship
- The button changes to **Following** or **Unfollow**
- The follower count increases by 1
- A success message may appear briefly
- The followed user receives a notification
- The follower will now see the followed user's posts in their home feed

**Edge Cases:**

- User cannot follow themselves
- Following is idempotent (clicking multiple times has same effect)

---

## US-PROFILE-006: Unfollow User

### As a

Logged-in user

### I want to

Unfollow users I'm currently following

### So that

I can curate my feed and remove content I'm no longer interested in

### Acceptance Criteria

**When** a user views a profile they're following:

- The system displays an **Unfollow** or **Following** button
- The user clicks the button

**Then:**

- The system may show a confirmation dialog (optional)
- If confirmed, the system removes the follow relationship
- The button changes back to **Follow**
- The follower count decreases by 1
- The user will no longer see that user's posts in their home feed
- No notification is sent to the unfollowed user

---

## US-PROFILE-007 & 008: View Followers/Following List

- **As a:** Registered User or Guest
- **I want to:** Click on the "Followers" or "Following" count on any user profile.
- **So that:** I can see a list of those users in a modal without leaving the current page.

**Acceptance Criteria (AC):**

1. **Display Mode:** The list **must** be displayed in a **Modal/Dialog**. Clicking the backdrop or a "Close" button will dismiss it.
2. **User Item UI:** Each row in the list includes:

- **Avatar & Username:** Clickable, navigates to the selected user's profile and **closes** the modal.
- **Bio:** Displayed as a single-line preview (truncated with ellipsis if too long).
- **Action Button (Follow/Following):**
- **Self:** Hidden if the user in the list is the current logged-in user.
- **Not Following:** Displays "Follow" button (Primary style).
- **Already Following:** Displays "Following" button (Outline/Secondary style).

3. **Pagination:** Implementation of **Infinite Scroll** within the modal container (20 users per fetch).
4. **Empty State:** Show "No followers found" or "Not following anyone yet" if the list is empty.
5. **State Sync:** When a user clicks Follow/Unfollow inside the modal, the counts (Followers/Following) on the underlying Profile Page must update immediately without a page reload.

---

#### 2. Technical API Specification

- **Endpoints:**
- `GET /api/users/{userId}/followers?page={n}&size=20`
- `GET /api/users/{userId}/following?page={n}&size=20`

- **Response Structure:**

```json
{
  "content": [
    {
      "id": "uuid",
      "username": "string",
      "avatarUrl": "string",
      "bio": "string",
      "isFollowing": "boolean"
    }
  ],
  "pageable": { ... },
  "last": boolean,
  "totalElements": number
}

```

---

#### 3. Database & Backend Integration

- **Table:** `user_follows` (follower_id, followed_id)
- **Query Optimization:** \* Use `idx_follower_id` for "Following" queries.
- Use `idx_followed_id` for "Followers" queries.

- **Business Logic:** Ensure that the `isFollowing` boolean in the response is calculated based on the context of the **currently logged-in user**.

---

#### 4. Frontend Implementation Guidelines

- **State Management:** Use `Zustand` to manage `isOpen`, `modalType` (FOLLOWERS/FOLLOWING), and `targetUserId`.
- **Data Fetching:** Use `tanstack/react-query` with `useInfiniteQuery` for seamless scrolling.
- **Navigation:** Ensure `react-router-dom` navigation triggers the closing of the modal to prevent UI overlay issues.

---

## US-PROFILE-009: View User's Posts

### As a

User (logged in or guest)

### I want to

See all posts created by a specific user

### So that

I can browse their content and contributions

### Acceptance Criteria

**When** a user is on another user's profile:

**Then:**

- The system displays all posts by that user below the profile information
- Posts are shown in reverse chronological order (newest first)
- Each post displays:
  - Content preview (truncated if long)
  - Images (if any)
  - Topics
  - Like count, Comment count
  - Timestamp
- Posts are paginated or use infinite scroll
- Clicking on a post navigates to the post detail page
- Deleted posts are not shown
