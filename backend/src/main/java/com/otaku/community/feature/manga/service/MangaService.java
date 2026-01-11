package com.otaku.community.feature.manga.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.anime.integration.JikanIntegrationService;
import com.otaku.community.feature.manga.dto.MangaDto;
import com.otaku.community.feature.manga.integration.dto.JikanMangaListResponse;
import com.otaku.community.feature.manga.integration.dto.JikanMangaSingleResponse;
import com.otaku.community.feature.manga.mapper.MangaMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MangaService {

    private final JikanIntegrationService jikanIntegrationService;
    private final MangaMapper mangaMapper;
    private final com.otaku.community.feature.post.service.PostService postService;

    public PageResponse<MangaDto> searchManga(String query, String type, String status, int page) {
        log.debug("Searching manga with query: {}, type: {}, status: {}, page: {}", query, type, status, page);
        JikanMangaListResponse response = jikanIntegrationService.searchManga(query, type, status, page);
        return mapToPageResponse(response);
    }

    public MangaDto getMangaById(int id) {
        log.debug("Fetching manga details for id: {}", id);
        JikanMangaSingleResponse response = jikanIntegrationService.getMangaById(id);
        if (response.getData() == null) {
            throw new RuntimeException("Manga not found with id: " + id);
        }
        MangaDto mangaDto = mangaMapper.toDto(response.getData());

        // Fetch related posts
        try {
            var postsPage = postService.getPostsByReference("MANGA", (long) id, 1, 5);
            mangaDto.setRelatedPosts(postsPage.getData());
        } catch (Exception e) {
            log.error("Failed to fetch related posts for manga id: {}", id, e);
        }

        return mangaDto;
    }

    public PageResponse<MangaDto> getTopManga(int page) {
        log.debug("Fetching top manga for page: {}", page);
        JikanMangaListResponse response = jikanIntegrationService.getTopManga(page);
        return mapToPageResponse(response);
    }

    private PageResponse<MangaDto> mapToPageResponse(JikanMangaListResponse response) {
        List<MangaDto> dtos = response.getData().stream()
                .map(mangaMapper::toDto)
                .collect(Collectors.toList());

        JikanMangaListResponse.JikanPagination pagination = response.getPagination();
        int page = 1;
        int limit = 20;
        long total = 0;

        if (pagination != null) {
            page = pagination.getCurrentPage() != null ? pagination.getCurrentPage() : 1;
            if (pagination.getItems() != null) {
                limit = pagination.getItems().getPerPage() != null ? pagination.getItems().getPerPage() : 20;
                total = pagination.getItems().getTotal() != null ? pagination.getItems().getTotal() : 0;
            }
        }

        return PageResponse.of(dtos, page, limit, total);
    }
}
