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
public class UploadJobResponse {
    private UUID uploadJobId;
    private UUID translationId;
    private String status;
    private Integer uploadedPages;
    private Integer totalPages;
    private String errorMessage;
    private Integer progress;
}
