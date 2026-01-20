package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTranslationRequest {
    private String name;
    private String notes;
}
