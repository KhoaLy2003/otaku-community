package com.otaku.community.feature.media.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "Media upload request")
public class MediaUploadRequest {
    
    @NotNull(message = "File is required")
    @Schema(description = "Media file to upload", required = true)
    private MultipartFile file;
    
    @Schema(description = "Optional description for the media")
    private String description;
}