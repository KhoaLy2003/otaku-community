# Media Upload Module

This module handles media file uploads and management for the Otaku Community platform using Cloudinary as the storage
service.

## Features

- **File Upload**: Upload images and videos to Cloudinary
- **File Validation**: Comprehensive validation for file type, size, and format
- **Supported Formats**:
    - Images: JPEG, PNG, GIF, WebP
    - Videos: MP4
- **File Size Limit**: 5MB per file
- **Secure URLs**: Returns secure HTTPS URLs for uploaded media
- **File Deletion**: Remove media files from Cloudinary storage

## Components

### MediaService

Core service for handling media operations:

- `uploadMedia(MultipartFile file)`: Upload a file to Cloudinary
- `deleteMedia(String publicId)`: Delete a file from Cloudinary

### MediaValidator

Utility class for file validation:

- File type validation (JPEG, PNG, GIF, WebP, MP4)
- File size validation (max 5MB)
- File extension validation
- Content type validation

### MediaController

REST endpoints for media operations:

- `POST /media/upload`: Upload a media file
- `DELETE /media/{publicId}`: Delete a media file

## API Endpoints

### Upload Media

```http
POST /api/media/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <multipart-file>
```

**Response:**

```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
    "publicId": "sample",
    "resourceType": "image",
    "format": "jpg",
    "bytes": 1024000,
    "width": 1920,
    "height": 1080
  }
}
```

### Delete Media

```http
DELETE /api/media/{publicId}
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Media deleted successfully",
  "data": null
}
```

## Configuration

The module requires the following environment variables:

```yaml
cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}

app:
  upload:
    max-image-size: 5242880 # 5MB in bytes
```

## Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid file format, size, or missing file
- **401 Unauthorized**: Missing or invalid authentication
- **413 Payload Too Large**: File exceeds size limit
- **415 Unsupported Media Type**: Invalid file type
- **500 Internal Server Error**: Cloudinary service errors

## Security

- All endpoints require authentication (`@PreAuthorize("hasRole('USER')")`)
- Files are uploaded to a secure Cloudinary folder (`otaku-community`)
- Automatic optimization for images (quality and format)
- Unique filename generation to prevent conflicts

## Usage Example

```java

@Autowired
private MediaService mediaService;

public void uploadUserAvatar(MultipartFile file) {
    try {
        MediaUploadResponse response = mediaService.uploadMedia(file);
        String imageUrl = response.getUrl();
        // Save imageUrl to user profile
    } catch (MediaValidationException e) {
        // Handle validation errors
    } catch (MediaUploadException e) {
        // Handle upload errors
    }
}
```