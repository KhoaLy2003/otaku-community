package com.otaku.community.common.dto;

import com.otaku.community.feature.integration.jikan.dto.JikanListResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> data;
    private PaginationMeta pagination;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationMeta {
        private int page;
        private int limit;
        private long total;
        private int totalPages;
        private boolean hasNext;
        private boolean hasPrev;
    }

    public static <T> PageResponse<T> of(List<T> data, int page, int limit, long total) {
        int totalPages = (int) Math.ceil((double) total / limit);

        PaginationMeta pagination = PaginationMeta.builder()
                .page(page)
                .limit(limit)
                .total(total)
                .totalPages(totalPages)
                .hasNext(page < totalPages)
                .hasPrev(page > 1)
                .build();

        return PageResponse.<T>builder()
                .data(data)
                .pagination(pagination)
                .build();
    }

    public static <S, T> PageResponse<T> toPageResponseFromJikan(
            JikanListResponse<S> response,
            List<T> dtos
    ) {
        JikanListResponse.JikanPagination pagination = response.getPagination();

        int page = 1;
        int limit = 20;
        long total = 0;

        if (pagination != null) {
            page = pagination.getCurrentPage() != null
                    ? pagination.getCurrentPage()
                    : page;

            if (pagination.getItems() != null) {
                limit = pagination.getItems().getPerPage() != null
                        ? pagination.getItems().getPerPage()
                        : limit;

                total = pagination.getItems().getTotal() != null
                        ? pagination.getItems().getTotal()
                        : total;
            }
        }

        return PageResponse.of(dtos, page, limit, total);
    }
}
