# Topic Model

## Attributes (name: data type)
- `id`: UUID (Primary Key) - Unique identifier for the topic
- `name`: VARCHAR(100), unique - Display name of the topic
- `slug`: VARCHAR(100), unique - URL-friendly version of the name
- `description`: TEXT - Description of what the topic is about
- `icon`: VARCHAR(255) - Optional icon/emoji for the topic
- `color`: VARCHAR(7) - Optional hex color code for UI theming
- `created_at`: TIMESTAMPTZ - Timestamp when topic was created
- `updated_at`: TIMESTAMPTZ - Timestamp when topic was last updated
- `deleted_at`: TIMESTAMPTZ (nullable) - Soft delete timestamp

## Validation
- `name`: Required, 2-100 characters, unique (case-insensitive)
- `slug`: Required, 2-100 characters, lowercase, alphanumeric and hyphens only, unique
- `description`: Optional, maximum 500 characters
- `icon`: Optional, single emoji or icon identifier
- `color`: Optional, valid hex color code (e.g., "#FF5733")

## Relationships
- **Has many Posts**: A topic can be associated with multiple posts
  - Through: `post_topics` junction table
  - Relationship: `post_topics.topic_id` → `topics.id`
  - On delete: CASCADE (if topic deleted, associations are deleted)
  
- **Followed by many Users**: A topic can be followed by multiple users
  - Through: `user_topics` or `topic_follows` junction table (future)
  - Relationship: `topic_follows.topic_id` → `topics.id`
  - On delete: CASCADE (if topic deleted, follows are deleted)

## Business Rules
- Topic names must be unique (case-insensitive)
- Topic slugs must be unique and URL-safe
- Only admins can create new topics
- Only admins can edit topic information
- Only admins can delete topics
- Deleted topics are soft-deleted (not permanently removed)
- Posts can be associated with multiple topics (max 5)
- Users can follow topics to see related posts in their feed
- Topic slugs are automatically generated from names if not provided
- Default topics are seeded during initial setup:
  - Anime
  - Manga
  - JLPT Learning
  - Japan Culture
  - Japan Food
  - Japan Travel
  - Japanese Life & Work
- Topic icons and colors are optional for MVP
- Topics cannot be merged in MVP (future enhancement)
- Topic hierarchy/subcategories not supported in MVP (future enhancement)
- Topic statistics (post count, follower count) are calculated dynamically
- Trending topics are determined by recent post activity (future enhancement)
- Topics are displayed alphabetically in selection lists
- Empty topics (no posts) are still shown in topic lists
- Topic descriptions support basic text only (no HTML in MVP)

## Indexes
- `idx_topics_name` - For topic search and lookups
- `idx_topics_slug` - For URL routing
- `idx_topics_deleted_at_null` - For filtering out deleted topics

## Predefined Topics (MVP)

### 1. Anime
- **Slug:** `anime`
- **Description:** Discuss your favorite anime series, movies, and characters
- **Icon:** 🎬
- **Color:** #FF6B9D

### 2. Manga
- **Slug:** `manga`
- **Description:** Share and discuss manga, light novels, and visual novels
- **Icon:** 📚
- **Color:** #4ECDC4

### 3. JLPT Learning
- **Slug:** `jlpt-learning`
- **Description:** Japanese language learning resources, tips, and study groups
- **Icon:** 📝
- **Color:** #95E1D3

### 4. Japan Culture
- **Slug:** `japan-culture`
- **Description:** Traditional and modern Japanese culture, festivals, and customs
- **Icon:** ⛩️
- **Color:** #F38181

### 5. Japan Food
- **Slug:** `japan-food`
- **Description:** Japanese cuisine, recipes, restaurants, and food experiences
- **Icon:** 🍜
- **Color:** #FFA07A

### 6. Japan Travel
- **Slug:** `japan-travel`
- **Description:** Travel tips, itineraries, and experiences in Japan
- **Icon:** ✈️
- **Color:** #87CEEB

### 7. Japanese Life & Work
- **Slug:** `japanese-life-work`
- **Description:** Living and working in Japan, visa information, and daily life
- **Icon:** 🏢
- **Color:** #DDA15E

## Future Enhancements
- Topic moderators (users who can manage posts in specific topics)
- Topic rules and guidelines
- Topic banners/cover images
- Related topics suggestions
- Topic merge functionality
- Topic aliases (multiple names for same topic)
- Private/restricted topics
- Topic activity metrics and analytics
