# Post Media Upload Implementation Guide

## Overview
This guide covers the implementation of media upload functionality for posts, including file uploads, media management, and API endpoints.

## Features Implemented

### 1. Media Upload Support
- **Multiple file types**: Images, Videos, GIFs
- **Multiple files per post**: Support for uploading multiple media files
- **Cloud storage**: Integration with Cloudinary for media storage
- **Metadata tracking**: Width, height, duration, thumbnails
- **Order management**: Configurable display order for media items

### 2. Database Schema
New `post_media` table with the following structure:
- `id` - UUID primary key
- `post_id` - Foreign key to posts table
- `media_type` - ENUM('IMAGE', 'VIDEO', 'GIF')
- `media_url` - URL to the media file
- `thumbnail_url` - Thumbnail URL (for videos)
- `width`, `height` - Media dimensions
- `duration_sec` - Duration for videos
- `order_index` - Display order within post

### 3. API Endpoints

#### Post Creation/Update
- `POST /posts` - Create post with media URLs
- `POST /posts/with-files` - Create post with file uploads
- `PUT /posts/{postId}` - Update post (including media)

#### Media Management
- `POST /posts/{postId}/media/upload` - Upload files to existing post
- `POST /posts/{postId}/media` - Add media from URLs
- `GET /posts/{postId}/media` - Get all media for a post
- `PUT /posts/{postId}/media/order` - Update media display order
- `DELETE /posts/{postId}/media/{mediaId}` - Delete specific media

## Usage Examples

### 1. Create Post with File Upload
```bash
curl -X POST "http://localhost:8080/posts/with-files" \
  -H "Authorization: Bearer {token}" \
  -F "title=My Post with Media" \
  -F "content=Check out these images!" \
  -F "status=PUBLISHED" \
  -F "files=@image1.jpg" \
  -F "files=@video1.mp4"
```

### 2. Create Post with Media URLs
```json
POST /posts
{
  "title": "My Post",
  "content": "Post content",
  "mediaItems": [
    {
      "mediaType": "IMAGE",
      "mediaUrl": "https://example.com/image.jpg",
      "width": 1920,
      "height": 1080
    }
  ],
  "status": "PUBLISHED"
}
```

### 3. Upload Media to Existing Post
```bash
curl -X POST "http://localhost:8080/posts/{postId}/media/upload" \
  -H "Authorization: Bearer {token}" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

### 4. Update Media Order
```json
PUT /posts/{postId}/media/order
[
  "media-id-2",
  "media-id-1",
  "media-id-3"
]
```

## Response Structure

### PostResponse (Updated)
```json
{
  "id": "uuid",
  "title": "Post Title",
  "content": "Post content",
  "media": [
    {
      "id": "uuid",
      "postId": "uuid",
      "mediaType": "IMAGE",
      "mediaUrl": "https://cloudinary.com/...",
      "thumbnailUrl": null,
      "width": 1920,
      "height": 1080,
      "durationSec": null,
      "orderIndex": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "likeCount": 5,
  "commentCount": 3,
  "status": "PUBLISHED",
  "userId": "uuid",
  "user": { ... },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Implementation Details

### 1. Services
- **PostMediaService**: Handles media operations (upload, delete, order)
- **PostService**: Updated to include media in post operations
- **MediaService**: Existing service for Cloudinary integration

### 2. DTOs
- **PostMediaRequest**: For adding media from URLs
- **PostMediaResponse**: Media information in responses
- **CreatePostRequest**: Updated to include mediaItems
- **UpdatePostRequest**: Updated to include mediaItems

### 3. Security
- **Ownership verification**: Users can only manage media for their own posts
- **File validation**: MediaValidator ensures safe file uploads
- **Authentication**: All media operations require authentication

### 4. Error Handling
- **File validation errors**: Invalid file types, size limits
- **Ownership errors**: Access denied for non-owners
- **Upload failures**: Cloudinary upload errors
- **Not found errors**: Post or media not found

## File Upload Constraints

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP
- **Videos**: MP4, MOV, AVI, WebM
- **Size limits**: As configured in MediaValidator

### Automatic Processing
- **Thumbnails**: Auto-generated for videos
- **Metadata extraction**: Width, height from uploaded files
- **Cloud optimization**: Cloudinary handles compression and optimization

## Migration Notes

### Database Changes
- Posts table: Removed `media_urls` column
- New `post_media` table with proper relationships
- Updated statistics tracking with `post_stats` table

### API Compatibility
- Existing endpoints maintain backward compatibility
- New endpoints added for enhanced functionality
- Response structure updated to include media array

## Best Practices

### 1. Frontend Integration
- Use FormData for file uploads
- Implement progress indicators for large files
- Handle upload errors gracefully
- Preview media before upload

### 2. Performance
- Lazy load media in post lists
- Use thumbnails for video previews
- Implement pagination for media-heavy posts
- Cache media URLs appropriately

### 3. User Experience
- Drag-and-drop file upload
- Media reordering interface
- Delete confirmation dialogs
- Upload progress feedback

## Testing

### Unit Tests
- PostMediaService operations
- File upload validation
- Media order management
- Error handling scenarios

### Integration Tests
- End-to-end post creation with media
- Media upload and retrieval
- Permission checks
- Database consistency

## Future Enhancements

### Potential Features
- **Video duration extraction**: Automatic duration detection
- **Image compression**: Client-side compression before upload
- **Media galleries**: Enhanced display options
- **Bulk operations**: Upload multiple posts with media
- **Media analytics**: View counts, engagement metrics