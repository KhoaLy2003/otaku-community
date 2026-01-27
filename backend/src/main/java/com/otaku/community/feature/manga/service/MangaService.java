package com.otaku.community.feature.manga.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.integration.jikan.JikanIntegrationService;
import com.otaku.community.feature.integration.jikan.dto.JikanListResponse;
import com.otaku.community.feature.manga.dto.chapter.ChapterResponse;
import com.otaku.community.feature.manga.dto.manga.MangaDto;
import com.otaku.community.feature.manga.entity.Chapter;
import com.otaku.community.feature.manga.entity.Manga;
import com.otaku.community.feature.manga.integration.dto.JikanMangaData;
import com.otaku.community.feature.manga.integration.dto.JikanMangaSingleResponse;
import com.otaku.community.feature.manga.mapper.MangaMapper;
import com.otaku.community.feature.manga.repository.ChapterRepository;
import com.otaku.community.feature.manga.repository.MangaRepository;
import com.otaku.community.feature.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Service for handling manga-related operations.
 * This service fetches data from the Jikan API and maps it to DTOs.
 * It also includes caching to improve performance.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class MangaService {

    private final JikanIntegrationService jikanIntegrationService;
    private final MangaMapper mangaMapper;
    private final PostService postService;
    private final MangaRepository mangaRepository;
    private final ChapterRepository chapterRepository;

    /**
     * Ensures a manga exists in the local database, syncing from Jikan if
     * necessary.
     */
    public Manga getOrCreateManga(int malId) {
        return mangaRepository.findByMalId(malId)
                .orElseGet(() -> {
                    log.info("Manga not found locally, syncing from Jikan for malId: {}", malId);
                    JikanMangaSingleResponse response = jikanIntegrationService.getMangaById(malId);
                    if (response.getData() == null) {
                        throw new ResourceNotFoundException("Manga not found with id: " + malId);
                    }
                    var data = response.getData();
                    Manga manga = Manga.builder()
                            .malId(malId)
                            .title(data.getTitle())
                            .titleEn(data.getTitle())
                            .coverImage(data.getImages().getJpg().getLargeImageUrl())
                            .build();
                    return mangaRepository.save(manga);
                });
    }

    /**
     * Ensures a chapter exists in the local database for a given manga.
     */
    public Chapter getOrCreateChapter(UUID mangaId, BigDecimal chapterNumber, String title) {
        return chapterRepository.findByMangaIdAndChapterNumber(mangaId, chapterNumber)
                .orElseGet(() -> {
                    Manga manga = mangaRepository.findById(mangaId)
                            .orElseThrow(() -> new RuntimeException("Manga not found with id: " + mangaId));
                    Chapter chapter = Chapter.builder()
                            .manga(manga)
                            .chapterNumber(chapterNumber)
                            .title(title)
                            .build();
                    return chapterRepository.save(chapter);
                });
    }

    /**
     * Finds chapters for a manga.
     */
    public List<Chapter> getChapters(UUID mangaId) {
        return chapterRepository.findByMangaIdAndNotDeleted(mangaId);
    }

    /**
     * Searches for manga based on a query and filters.
     * The results are cached.
     *
     * @param query  The search query.
     * @param type   The type of manga to search for.
     * @param status The status of the manga.
     * @param page   The page number of the search results.
     * @return A paginated response of manga DTOs.
     * @sampleCacheKey mangaSearch::one piece:manga:publishing:1
     * @see Cacheable
     */
    @Cacheable(value = "mangaSearch", key = "#query + ':' + #type + ':' + #status + ':' + #page")
    public PageResponse<MangaDto> searchManga(String query, String type, String status, int page) {
        log.debug("Searching manga with query: {}, type: {}, status: {}, page: {}", query, type, status, page);
        JikanListResponse<JikanMangaData> response = jikanIntegrationService.searchManga(query, type, status, page);
        return mapToPageResponse(response);
    }

    /**
     * Retrieves a single manga by its ID.
     * The result is cached.
     *
     * @param id The ID of the manga.
     * @return The manga DTO.
     * @throws RuntimeException if the manga is not found.
     * @sampleCacheKey mangaDetail::1
     * @see Cacheable
     */
    // @Cacheable(value = "mangaDetail", key = "#id")
    public MangaDto getMangaById(int id) {
        log.debug("Fetching manga details for id: {}", id);
        JikanMangaSingleResponse response = jikanIntegrationService.getMangaById(id);
        if (response.getData() == null) {
            throw new ResourceNotFoundException("Manga not found with id: " + id);
        }

        MangaDto mangaDto = mangaMapper.toDto(response.getData());

        // Check if manga exists locally and set internal ID + chapters
        mangaRepository.findByMalId(id).ifPresent(manga -> {
            mangaDto.setId(manga.getId());

            // Fetch and include chapter list
            List<Chapter> chapters = chapterRepository.findByMangaIdAndNotDeleted(manga.getId());
            if (!chapters.isEmpty()) {
                List<ChapterResponse> chapterResponses = chapters.stream()
                        .map(chapter -> ChapterResponse.builder()
                                .id(chapter.getId())
                                .chapterNumber(chapter.getChapterNumber())
                                .title(chapter.getTitle())
                                .build())
                        .toList();
                mangaDto.setChapterList(chapterResponses);
            }
        });

        // Fetch related posts
        try {
            var postsPage = postService.getPostsByReference("MANGA", (long) id, 1, 5);
            mangaDto.setRelatedPosts(postsPage.getData());
        } catch (Exception e) {
            log.error("Failed to fetch related posts for manga id: {}", id, e);
        }

        return mangaDto;
    }

    /**
     * Retrieves the top-rated manga.
     * The results are cached.
     *
     * @param page The page number of the results.
     * @return A paginated response of top manga DTOs.
     * @sampleCacheKey mangaTop::1
     * @see Cacheable
     */
    @Cacheable(value = "mangaTop", key = "#page")
    public PageResponse<MangaDto> getTopManga(int page) {
        log.debug("Fetching top manga for page: {}", page);
        JikanListResponse<JikanMangaData> response = jikanIntegrationService.getTopManga(page);
        return mapToPageResponse(response);
    }

    /**
     * Maps a Jikan list response to a paginated response of manga DTOs.
     *
     * @param response The Jikan list response.
     * @return A paginated response of manga DTOs.
     */
    private PageResponse<MangaDto> mapToPageResponse(JikanListResponse<JikanMangaData> response) {
        List<MangaDto> dtos = response.getData().stream()
                .map(mangaMapper::toDto)
                .toList();

        return PageResponse.toPageResponseFromJikan(response, dtos);
    }
}
