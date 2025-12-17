# Comment Model

## Attributes (name: data type)
- `id`: UUID (Primary Key) - Unique identifier for the comment
- `post_id`: UUID (Foreign Key → posts.id) - The post this comment belongs to
- `user_id`: UUID (Foreign Key → users.id) - Author of the comment
- `content`: TEXT - Comment text content (required)
- `parent_id`: UUID (Foreign Key → comments.id, nullable) - For nested replies (future enhancement)
- `created_at`: TIMESTAMPTZ - Timestamp when comment was created
- `updated_at`: TIMESTAMPTZ - Timestamp when comment was last edited
- `deleted_at`: TIMESTAMPTZ (nullable) - Soft delete timestamp

## Validation
- `content`: Required, minimum 1 character, maximum 1000 characters
- `content`: Cannot be only whitespace
- `post_id`: Must reference an existing, non-deleted post
- `user_id`: Must reference an existing, non-deleted user
- `parent_id`: If provided, must reference an existing comment on the same post

## Relationships
- **Belongs to Post**: Each comment belongs to one post
  - Foreign key: `post_id` → `posts.id`
  - On delete: CASCADE (if post deleted, comments are deleted)
  
- **Belongs to User** (author): Each comment has one author
  - Foreign key: `user_id` → `users.id`
  - On delete: CASCADE (if user deleted, comments are deleted)
  
- **Has many Replies**: A comment can have multiple replies (future enhancement)
  - Relationship: `comments.parent_id` → `comments.id`
  - On delete: CASCADE (if parent deleted, replies are deleted)
  
- **Belongs to Parent Comment**: A reply belongs to a parent comment (future enhancement)
  - Foreign key: `parent_id` → `comments.id`
  - On delete: CASCADE
  
- **Referenced in Notifications**: Comments trigger notifications
  - Relationship: `notifications.comment_id` → `comments.id`
  - On delete: SET NULL (if comment deleted, notification remains but comment_id is null)

## Business Rules
- A comment must have at least 1 character of content
- Only the comment author or an admin can edit a comment
- Only the comment author or an admin can delete a comment
- Deleted comments (soft delete) are not shown in the UI
- Deleted comments cannot be edited
- Comment creation triggers a notification to the post author
- Comment replies trigger notifications to the parent comment author
- Comments are displayed in chronological order (oldest first)
- Comments cannot be restored after soft delete
- Users can comment on their own posts
- Comments on deleted posts are also hidden
- Comment timestamps are automatically managed by the database
- Users cannot comment on posts from banned users

## Indexes
- `idx_comments_post_id` - For fetching all comments on a post
- `idx_comments_user_id` - For fetching all comments by a user
- `idx_comments_deleted_at_null` - For filtering out deleted comments
- `idx_comments_parent_id` - For fetching replies to a comment (future)
- `idx_comments_created_at` - For sorting by timestamp

## Display Rules
- Comments show author's username and avatar
- Comments show relative timestamps (e.g., "2 hours ago")
- Long comments are not truncated in the UI
- Deleted comments show "[deleted]" placeholder (future enhancement)
- Edit indicator shows if comment was edited (future enhancement)
