package com.otaku.community.feature.post.dto;

import com.otaku.community.feature.post.entity.PostMedia;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Post media response")
public class PostMediaResponse {

    @Schema(description = "Media ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Post ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID postId;

    @Schema(description = "Media type", example = "IMAGE")
    private PostMedia.MediaType mediaType;

    @Schema(description = "Media URL", example = "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg")
    private String mediaUrl;

    @Schema(description = "Thumbnail URL (for videos)", example = "https://res.cloudinary.com/demo/image/upload/c_thumb,w_300,h_200/sample.jpg")
    private String thumbnailUrl;

    @Schema(description = "Media width in pixels", example = "1920")
    private Integer width;

    @Schema(description = "Media height in pixels", example = "1080")
    private Integer height;

    @Schema(description = "Duration in seconds (for videos)", example = "120")
    private Integer durationSec;

    @Schema(description = "Display order within post", example = "0")
    private Integer orderIndex;

    @Schema(description = "Creation timestamp")
    private Instant createdAt;
}