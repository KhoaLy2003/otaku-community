package com.otaku.community.feature.media.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Media upload response")
public class MediaUploadResponse {

    @Schema(description = "Secure URL of the uploaded media", example = "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg")
    private String url;

    @Schema(description = "Public ID of the uploaded media", example = "sample")
    private String publicId;

    @Schema(description = "File type of the uploaded media", example = "image")
    private String resourceType;

    @Schema(description = "Format of the uploaded media", example = "jpg")
    private String format;

    @Schema(description = "Size of the uploaded media in bytes", example = "1024000")
    private Long bytes;

    @Schema(description = "Width of the media (for images/videos)", example = "1920")
    private Integer width;

    @Schema(description = "Height of the media (for images/videos)", example = "1080")
    private Integer height;
}