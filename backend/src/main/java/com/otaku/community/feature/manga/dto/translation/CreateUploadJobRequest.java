package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUploadJobRequest {
    private UUID mangaId;
    private UUID chapterId;
    private String translationName;
    private String notes;
}
