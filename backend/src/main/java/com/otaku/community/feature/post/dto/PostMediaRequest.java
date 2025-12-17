package com.otaku.community.feature.post.dto;

import com.otaku.community.feature.post.entity.PostMedia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostMediaRequest {

    @NotNull(message = "Media type is required")
    private PostMedia.MediaType mediaType;

    @NotBlank(message = "Media URL is required")
    private String mediaUrl;

    private String thumbnailUrl;

    private Integer width;

    private Integer height;

    private Integer durationSec;
}