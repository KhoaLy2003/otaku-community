package com.otaku.community.feature.manga.dto.translation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderPagesRequest {
    private List<PageOrderRequest> pages;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageOrderRequest {
        private UUID pageId;
        private Integer pageIndex;
    }
}
