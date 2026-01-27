package com.otaku.community.feature.media.util;

import com.otaku.community.feature.media.exception.MediaValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class MediaValidator {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of(
            "video/mp4"
    );

    private static final Set<String> IMAGE_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp"
    );

    private static final Set<String> VIDEO_EXTENSIONS = Set.of(
            "mp4"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "mp4"
    );

    @Value("${app.upload.max-image-size:5242880}") // 5MB default
    private long maxFileSize;

    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new MediaValidationException("File is required and cannot be empty");
        }

        validateFileSize(file);
        validateFileExtension(file);
        validateFileTypeOrExtension(file);
    }

    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > maxFileSize) {
            throw new MediaValidationException(
                    String.format("File size exceeds maximum allowed size of %.1f MB",
                            maxFileSize / 1024.0 / 1024.0)
            );
        }
    }

    /**
     * ✔ Content-Type có → validate theo content-type
     * ✔ Content-Type null → fallback validate theo extension
     */
    private void validateFileTypeOrExtension(MultipartFile file) {
        String contentType = file.getContentType();
        String extension = getFileExtension(file.getOriginalFilename()).toLowerCase();

        if (contentType != null) {
            if (!ALLOWED_IMAGE_TYPES.contains(contentType)
                    && !ALLOWED_VIDEO_TYPES.contains(contentType)) {
                throw new MediaValidationException(
                        "Unsupported file type: " + contentType
                );
            }
            return;
        }

        // fallback: contentType == null (CustomMultipartFile case)
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new MediaValidationException(
                    "Unsupported file extension: " + extension
            );
        }
    }

    private void validateFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new MediaValidationException("File name is required");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new MediaValidationException(
                    "Unsupported file extension: " + extension
            );
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }

    public boolean isImageFile(MultipartFile file) {
        if (file.getContentType() != null) {
            return ALLOWED_IMAGE_TYPES.contains(file.getContentType());
        }
        return IMAGE_EXTENSIONS.contains(
                getFileExtension(file.getOriginalFilename()).toLowerCase()
        );
    }

    public boolean isVideoFile(MultipartFile file) {
        if (file.getContentType() != null) {
            return ALLOWED_VIDEO_TYPES.contains(file.getContentType());
        }
        return VIDEO_EXTENSIONS.contains(
                getFileExtension(file.getOriginalFilename()).toLowerCase()
        );
    }
}