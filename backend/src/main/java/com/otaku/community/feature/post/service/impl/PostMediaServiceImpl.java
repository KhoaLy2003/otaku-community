package com.otaku.community.feature.post.service.impl;

import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.media.dto.MediaUploadResponse;
import com.otaku.community.feature.media.service.MediaService;
import com.otaku.community.feature.post.dto.PostMediaRequest;
import com.otaku.community.feature.post.dto.PostMediaResponse;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.entity.PostMedia;
import com.otaku.community.feature.post.mapper.PostMediaMapper;
import com.otaku.community.feature.post.repository.PostMediaRepository;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.post.service.PostMedialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostMediaServiceImpl implements PostMedialService {

    private final PostMediaRepository postMediaRepository;
    private final PostRepository postRepository;
    private final MediaService mediaService;
    private final PostMediaMapper postMediaMapper;

    /**
     * Upload and save media files for a post
     */
    @Override
    @Transactional
    public List<PostMediaResponse> uploadPostMedia(UUID postId, List<MultipartFile> files) {
        log.debug("Uploading {} media files for post {}", files.size(), postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.getMedias().clear();
        postRepository.flush();
        
        List<PostMediaResponse> responses = new ArrayList<>();
        
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            
            // Upload to cloud storage
            MediaUploadResponse uploadResponse = mediaService.uploadMedia(file);
            
            // Determine media type
            PostMedia.MediaType mediaType = determineMediaType(uploadResponse.getResourceType(), uploadResponse.getFormat());
            
            // Create PostMedia entity
            PostMedia postMedia = PostMedia.builder()
                    .postId(postId)
                    .mediaType(mediaType)
                    .mediaUrl(uploadResponse.getUrl())
                    .thumbnailUrl(generateThumbnailUrl(uploadResponse))
                    .width(uploadResponse.getWidth())
                    .height(uploadResponse.getHeight())
                    .durationSec(null) // TODO: Extract duration for videos if needed
                    .orderIndex(i)
                    .build();
            
            // Save to database
            PostMedia savedMedia = postMediaRepository.save(postMedia);
            log.debug("Uploaded media {} for post {}", savedMedia.getId(), postId);
        }
        
        log.info("Successfully uploaded {} media files for post {}", files.size(), postId);
        return responses;
    }

    /**
     * Add media from URLs (for existing media or external sources)
     */
    @Transactional
    public List<PostMediaResponse> addPostMediaFromUrls(UUID postId, List<PostMediaRequest> mediaRequests) {
        log.debug("Adding {} media URLs for post {}", mediaRequests.size(), postId);
        
        List<PostMediaResponse> responses = new ArrayList<>();
        
        for (int i = 0; i < mediaRequests.size(); i++) {
            PostMediaRequest request = mediaRequests.get(i);
            
            PostMedia postMedia = PostMedia.builder()
                    .postId(postId)
                    .mediaType(request.getMediaType())
                    .mediaUrl(request.getMediaUrl())
                    .thumbnailUrl(request.getThumbnailUrl())
                    .width(request.getWidth())
                    .height(request.getHeight())
                    .durationSec(request.getDurationSec())
                    .orderIndex(i)
                    .build();
            
            PostMedia savedMedia = postMediaRepository.save(postMedia);
//            PostMediaResponse response = postMediaMapper.toResponse(savedMedia);
//            responses.add(response);
        }
        
        log.info("Successfully added {} media URLs for post {}", mediaRequests.size(), postId);
        return responses;
    }

    /**
     * Get all media for a post
     */
    @Transactional(readOnly = true)
    public List<PostMediaResponse> getPostMedia(UUID postId) {
        List<PostMedia> mediaList = postMediaRepository.findByPostIdOrderByOrderIndexAsc(postId);
        return postMediaMapper.toResponseList(mediaList);
    }

    /**
     * Update media order for a post
     */
    @Transactional
    public List<PostMediaResponse> updateMediaOrder(UUID postId, List<UUID> mediaIds) {
        log.debug("Updating media order for post {}", postId);
        
        List<PostMedia> mediaList = postMediaRepository.findByPostIdOrderByOrderIndexAsc(postId);
        
        // Update order based on provided IDs
        for (int i = 0; i < mediaIds.size(); i++) {
            UUID mediaId = mediaIds.get(i);
            PostMedia media = mediaList.stream()
                    .filter(m -> m.getId().equals(mediaId))
                    .findFirst()
                    .orElse(null);
            
            if (media != null) {
                media.setOrderIndex(i);
                postMediaRepository.save(media);
            }
        }
        
        return getPostMedia(postId);
    }

    /**
     * Delete media from a post
     */
    @Transactional
    public void deletePostMedia(UUID postId, UUID mediaId) {
        log.debug("Deleting media {} from post {}", mediaId, postId);
        
        PostMedia media = postMediaRepository.findById(mediaId)
                .filter(m -> m.getPostId().equals(postId))
                .orElseThrow(() -> new RuntimeException("Media not found or doesn't belong to this post"));
        
        // Delete from cloud storage (extract public ID from URL)
        String publicId = extractPublicIdFromUrl(media.getMediaUrl());
        if (publicId != null) {
            mediaService.deleteMedia(publicId);
        }
        
        // Delete from database
        postMediaRepository.delete(media);
        
        log.info("Deleted media {} from post {}", mediaId, postId);
    }

    /**
     * Delete all media for a post (used when deleting a post)
     */
    @Transactional
    public void deleteAllPostMedia(UUID postId) {
        log.debug("Deleting all media for post {}", postId);
        
        List<PostMedia> mediaList = postMediaRepository.findByPostIdOrderByOrderIndexAsc(postId);
        
        for (PostMedia media : mediaList) {
            // Delete from cloud storage
            String publicId = extractPublicIdFromUrl(media.getMediaUrl());
            if (publicId != null) {
                mediaService.deleteMedia(publicId);
            }
        }
        
        // Delete all from database
        postMediaRepository.deleteByPostId(postId);
        
        log.info("Deleted all media for post {}", postId);
    }

    /**
     * Determine media type from upload response
     */
    private PostMedia.MediaType determineMediaType(String resourceType, String format) {
        if ("video".equals(resourceType)) {
            return PostMedia.MediaType.VIDEO;
        } else if ("image".equals(resourceType)) {
            if ("gif".equalsIgnoreCase(format)) {
                return PostMedia.MediaType.GIF;
            } else {
                return PostMedia.MediaType.IMAGE;
            }
        }
        return PostMedia.MediaType.IMAGE; // Default fallback
    }

    /**
     * Generate thumbnail URL for videos (Cloudinary auto-generates thumbnails)
     */
    private String generateThumbnailUrl(MediaUploadResponse uploadResponse) {
        if ("video".equals(uploadResponse.getResourceType())) {
            // For videos, generate thumbnail URL by modifying the original URL
            String originalUrl = uploadResponse.getUrl();
            // Replace /video/ with /image/ and add thumbnail transformation
            return originalUrl.replace("/video/upload/", "/image/upload/c_thumb,w_300,h_200/");
        }
        return null; // No thumbnail needed for images
    }

    /**
     * Extract Cloudinary public ID from URL for deletion
     */
    private String extractPublicIdFromUrl(String url) {
        try {
            // Extract public ID from Cloudinary URL
            // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
            String[] parts = url.split("/");
            if (parts.length >= 2) {
                String lastPart = parts[parts.length - 1];
                // Remove file extension
                int dotIndex = lastPart.lastIndexOf('.');
                if (dotIndex > 0) {
                    return lastPart.substring(0, dotIndex);
                }
                return lastPart;
            }
        } catch (Exception e) {
            log.warn("Failed to extract public ID from URL: {}", url, e);
        }
        return null;
    }
}