# User Model

## Attributes (name: data type)
- `id`: UUID (Primary Key) - Unique identifier for the user
- `email`: VARCHAR(255), unique - User's email address for login
- `username`: VARCHAR(50), unique - Display name (case-insensitive for uniqueness)
- `password_hash`: TEXT - Bcrypt hashed password
- `avatar_url`: TEXT - URL to user's profile picture on Cloudinary
- `bio`: TEXT - User biography/description
- `interests`: TEXT[] - Array of user interests (e.g., ["Anime", "Manga", "JLPT Learning"])
- `location`: VARCHAR(100) - User's location (optional)
- `role`: VARCHAR(20) - User role (default: "user", options: "user", "admin")
- `created_at`: TIMESTAMPTZ - Account creation timestamp
- `updated_at`: TIMESTAMPTZ - Last profile update timestamp
- `deleted_at`: TIMESTAMPTZ (nullable) - Soft delete timestamp (for banned users)

## Validation
- `email`: Required, valid email format, unique (case-insensitive), max 255 characters
- `username`: Required, 3-30 characters, alphanumeric and underscores only, unique (case-insensitive)
- `password`: Required on creation, minimum 8 characters, must contain uppercase, lowercase, and number
- `avatar_url`: Optional, must be valid HTTPS URL from Cloudinary
- `bio`: Optional, maximum 500 characters
- `interests`: Optional, array of strings, maximum 10 interests, each max 50 characters
- `location`: Optional, maximum 100 characters
- `role`: Must be one of: "user", "admin"

## Relationships
- **Has many Posts**: A user can create multiple posts
  - Relationship: `posts.user_id` → `users.id`
  - On delete: CASCADE (if user deleted, their posts are deleted)
  
- **Has many Comments**: A user can write multiple comments
  - Relationship: `comments.user_id` → `users.id`
  - On delete: CASCADE (if user deleted, their comments are deleted)
  
- **Has many Likes**: A user can like multiple posts
  - Relationship: `likes.user_id` → `users.id`
  - On delete: CASCADE (if user deleted, their likes are deleted)
  
- **Has many Followers**: A user can be followed by multiple users
  - Through: `follows` table
  - Relationship: `follows.following_id` → `users.id`
  - On delete: CASCADE (if user deleted, follow relationships are deleted)
  
- **Follows many Users**: A user can follow multiple users
  - Through: `follows` table
  - Relationship: `follows.follower_id` → `users.id`
  - On delete: CASCADE (if user deleted, follow relationships are deleted)
  
- **Has many Notifications**: A user receives notifications
  - Relationship: `notifications.user_id` → `users.id`
  - On delete: CASCADE (if user deleted, their notifications are deleted)
  
- **Triggers Notifications**: A user's actions create notifications for others
  - Relationship: `notifications.from_user_id` → `users.id`
  - On delete: SET NULL (if user deleted, notification remains but from_user_id is null)
  
- **Has many Reports**: A user can report multiple posts
  - Relationship: `reports.user_id` → `users.id`
  - On delete: CASCADE (if user deleted, their reports are deleted)
  
- **Has many Admin Actions**: Admin users can perform moderation actions
  - Relationship: `admin_actions.admin_user_id` → `users.id`
  - On delete: SET NULL (preserve audit log even if admin deleted)

## Business Rules
- Email and username must be unique across all users (case-insensitive)
- Passwords must never be stored in plain text (always bcrypt hashed)
- Users cannot follow themselves
- Users cannot like their own posts
- Deleted users (banned) cannot log in
- Deleted users' content is soft-deleted (not permanently removed)
- Username changes are allowed but must remain unique
- Email changes require verification (future enhancement)
- Default avatar is provided if user doesn't upload one
- User role defaults to "user" on registration
- Only admins can change user roles
- User statistics (followers, following, posts count) are calculated dynamically
- Interests are stored as an array for flexible querying
- Location is free-text (not validated against database)
- Bio supports basic text only (no HTML in MVP)
- Avatar images are automatically optimized by Cloudinary
- Users must be at least 13 years old (not enforced in MVP)
- Inactive accounts are not automatically deleted (future enhancement)
- Users can only have one account per email address
- Password reset requires email verification (future enhancement)
- Two-factor authentication is not supported in MVP (future enhancement)

## Indexes
- `idx_users_email` - For login queries
- `idx_users_username` - For profile lookups and search
- `idx_users_deleted_at_null` - For filtering out deleted users
- `idx_users_created_at` - For sorting by join date

## Security Considerations
- Email addresses are never exposed in public API responses
- Password hashes are never returned in API responses
- JWT tokens contain user_id, email, username, and role
- Failed login attempts should be rate-limited
- Account enumeration should be prevented (same error for invalid email/password)
- Admin role should be carefully controlled and audited
