# Post Model

## Attributes (name: data type)
- `id`: UUID (Primary Key) - Unique identifier for the post
- `user_id`: UUID (Foreign Key → users.id) - Author of the post
- `content`: TEXT - Post text content (required)
- `image_url`: TEXT - Optional image URL (deprecated, use images array)
- `images`: TEXT[] - Array of image URLs from Cloudinary
- `created_at`: TIMESTAMPTZ - Timestamp when post was created
- `updated_at`: TIMESTAMPTZ - Timestamp when post was last updated
- `deleted_at`: TIMESTAMPTZ (nullable) - Soft delete timestamp

## Validation
- `content`: Required, minimum 1 character, maximum 5000 characters
- `images`: Optional, maximum 4 images per post
- `images`: Each URL must be a valid HTTPS URL
- `images`: Each image must be from allowed domains (Cloudinary)
- `user_id`: Must reference an existing, non-deleted user
- `content`: Cannot be only whitespace

## Relationships
- **Belongs to User** (author): Each post has one author
  - Foreign key: `user_id` → `users.id`
  - On delete: CASCADE (if user deleted, posts are deleted)
  
- **Has many Comments**: A post can have multiple comments
  - Relationship: `comments.post_id` → `posts.id`
  - On delete: CASCADE (if post deleted, comments are deleted)
  
- **Has many Likes**: A post can be liked by multiple users
  - Relationship: `likes.post_id` → `posts.id`
  - On delete: CASCADE (if post deleted, likes are deleted)
  
- **Belongs to many Topics**: A post can have multiple topics
  - Through: `post_topics` junction table
  - Relationship: `post_topics.post_id` → `posts.id`
  - Relationship: `post_topics.topic_id` → `topics.id`
  - On delete: CASCADE (if post deleted, associations are deleted)
  
- **Has many Reports**: A post can be reported by multiple users
  - Relationship: `reports.post_id` → `posts.id`
  - On delete: CASCADE (if post deleted, reports are deleted)
  
- **Referenced in Notifications**: Post can trigger notifications
  - Relationship: `notifications.post_id` → `posts.id`
  - On delete: SET NULL (if post deleted, notification remains but post_id is null)

## Business Rules
- A post must have at least 1 character of content
- A post can have 0-4 images
- A post can be associated with 0-5 topics
- Only the post author or an admin can edit a post
- Only the post author or an admin can delete a post
- Deleted posts (soft delete) are not shown in feeds or search results
- Deleted posts cannot be edited or liked
- When a post is created, the author cannot like their own post immediately
- Post content is indexed for full-text search
- Post creation triggers no notification (only likes and comments do)
- Images must be uploaded to Cloudinary before post creation
- Post timestamps are automatically managed by the database
- Post edit history is not tracked in MVP (future enhancement)
- Posts cannot be restored after soft delete in MVP (future enhancement) 