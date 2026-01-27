package com.otaku.community.feature.manga.dto.translation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostTranslationCommentRequest {
    @NotBlank
    @Size(max = 1000)
    private String content;

    private UUID parentId;
}
