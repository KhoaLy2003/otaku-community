package com.otaku.community.feature.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.otaku.community.feature.media.dto.MediaUploadResponse;
import com.otaku.community.feature.media.exception.MediaUploadException;
import com.otaku.community.feature.media.util.MediaValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {

    private final Cloudinary cloudinary;
    private final MediaValidator mediaValidator;

    @Value("${cloudinary.folder}")
    private String folder;

    public MediaUploadResponse uploadMedia(MultipartFile file) {
        try {
            // Validate the file
            mediaValidator.validateFile(file);

            // Generate unique public ID
            String publicId = generatePublicId(file);

            // Determine resource type
            String resourceType = mediaValidator.isVideoFile(file) ? "video" : "image";

            // Upload to Cloudinary
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "public_id", publicId,
                    "resource_type", resourceType,
                    "folder", folder,
                    "use_filename", false,
                    "unique_filename", true,
                    "overwrite", false
            );

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            log.debug("Successfully uploaded media with public ID: {}", publicId);

            return mapToResponse(uploadResult);
        } catch (IOException e) {
            log.error("Failed to upload media: {}", e.getMessage(), e);
            throw new MediaUploadException("Failed to upload media file", e);
        } catch (Exception e) {
            log.error("Unexpected error during media upload: {}", e.getMessage(), e);
            throw new MediaUploadException("Unexpected error occurred during media upload", e);
        }
    }

    public void deleteMedia(String publicId) {
        try {
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");

            if (!"ok".equals(resultStatus)) {
                log.warn("Failed to delete media with public ID: {}. Result: {}", publicId, resultStatus);
            } else {
                log.debug("Successfully deleted media with public ID: {}", publicId);
            }
        } catch (Exception e) {
            log.error("Failed to delete media with public ID: {}. Error: {}", publicId, e.getMessage(), e);
            // Don't throw exception for delete failures to avoid breaking the main flow
        }
    }

    private String generatePublicId(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        return UUID.randomUUID() + extension;
    }

    private MediaUploadResponse mapToResponse(Map<String, Object> uploadResult) {
        MediaUploadResponse response = new MediaUploadResponse();
        response.setUrl((String) uploadResult.get("secure_url"));
        response.setPublicId((String) uploadResult.get("public_id"));
        response.setResourceType((String) uploadResult.get("resource_type"));
        response.setFormat((String) uploadResult.get("format"));
        response.setBytes(((Number) uploadResult.get("bytes")).longValue());

        // Width and height might not be present for all file types
        if (uploadResult.get("width") != null) {
            response.setWidth(((Number) uploadResult.get("width")).intValue());
        }
        if (uploadResult.get("height") != null) {
            response.setHeight(((Number) uploadResult.get("height")).intValue());
        }

        return response;
    }
}