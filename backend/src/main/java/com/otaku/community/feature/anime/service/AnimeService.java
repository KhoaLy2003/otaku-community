package com.otaku.community.feature.anime.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.JikanIntegrationException;
import com.otaku.community.feature.anime.dto.AnimeCharacterDto;
import com.otaku.community.feature.anime.dto.AnimeDto;
import com.otaku.community.feature.anime.dto.CharacterDto;
import com.otaku.community.feature.anime.dto.SeasonArchiveDto;
import com.otaku.community.feature.anime.mapper.AnimeMapper;
import com.otaku.community.feature.integration.jikan.JikanIntegrationService;
import com.otaku.community.feature.integration.jikan.dto.JikanAnimeData;
import com.otaku.community.feature.integration.jikan.dto.JikanCharacterData;
import com.otaku.community.feature.integration.jikan.dto.JikanCharactersResponse;
import com.otaku.community.feature.integration.jikan.dto.JikanListResponse;
import com.otaku.community.feature.integration.jikan.dto.JikanSeasonArchiveResponse;
import com.otaku.community.feature.integration.jikan.dto.JikanSingleResponse;
import com.otaku.community.feature.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for handling anime-related operations.
 * This service fetches data from the Jikan API and maps it to DTOs.
 * It also includes caching to improve performance.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AnimeService {

    private final JikanIntegrationService jikanIntegrationService;
    private final AnimeMapper animeMapper;
    private final PostService postService;

    /**
     * Searches for anime based on a query and filters.
     * The results are cached.
     *
     * @param query  The search query.
     * @param type   The type of anime to search for (e.g., "tv", "movie").
     * @param status The status of the anime (e.g., "airing", "complete").
     * @param page   The page number of the search results.
     * @return A paginated response of anime DTOs.
     * @sampleCacheKey animeSearch::naruto:tv:airing:1
     * @see Cacheable
     */
    @Cacheable(value = "animeSearch", key = "#query + ':' + #type + ':' + #status + ':' + #page")
    public PageResponse<AnimeDto> searchAnime(String query, String type, String status, int page) {
        log.debug("Searching anime with query: {}, type: {}, status: {}, page: {}", query, type, status, page);
        JikanListResponse<JikanAnimeData> response = jikanIntegrationService.searchAnime(query, type, status, page);
        return mapToPageResponse(response);
    }

    /**
     * Retrieves a single anime by its ID.
     * The result is cached.
     *
     * @param id The ID of the anime.
     * @return The anime DTO.
     * @throws RuntimeException if the anime is not found.
     * @sampleCacheKey animeDetail::1
     * @see Cacheable
     */
    @Cacheable(value = "animeDetail", key = "#id")
    public AnimeDto getAnimeById(int id) {
        log.debug("Fetching anime details for id: {}", id);
        JikanSingleResponse response = jikanIntegrationService.getAnimeById(id);
        if (response.getData() == null) {
            throw new JikanIntegrationException("Anime not found with id: " + id);
        }
        AnimeDto animeDto = animeMapper.toDto(response.getData());

        // Fetch characters and include in DTO
        try {
            List<AnimeCharacterDto> characters = getAnimeCharacters(id);
            animeDto.setCharacters(characters);
        } catch (Exception e) {
            log.error("Failed to fetch characters for anime id: {}", id, e);
            // Don't fail the whole request if characters fetch fails
        }

        // Fetch related posts
        try {
            var postsPage = postService.getPostsByReference("ANIME", (long) id, 1, 5);
            animeDto.setRelatedPosts(postsPage.getData());
        } catch (Exception e) {
            log.error("Failed to fetch related posts for anime id: {}", id, e);
        }

        return animeDto;
    }

    /**
     * Retrieves the currently trending anime.
     * The results are cached.
     *
     * @param page The page number of the results.
     * @return A paginated response of trending anime DTOs.
     * @sampleCacheKey animeTrending::1
     * @see Cacheable
     */
    @Cacheable(value = "animeTrending", key = "#page")
    public PageResponse<AnimeDto> getTrendingAnime(int page) {
        log.debug("Fetching trending anime for page: {}", page);
        // Using "airing" filter for trending
        JikanListResponse<JikanAnimeData> response = jikanIntegrationService.getTopAnime("airing", page);
        return mapToPageResponse(response);
    }

    /**
     * Retrieves the current seasonal anime.
     * The results are cached.
     *
     * @param page The page number of the results.
     * @return A paginated response of seasonal anime DTOs.
     * @sampleCacheKey animeSeasonal::current:1
     * @see Cacheable
     */
    @Cacheable(value = "animeSeasonal", key = "'current:' + #page")
    public PageResponse<AnimeDto> getSeasonalAnime(int page) {
        log.debug("Fetching seasonal anime for page: {}", page);
        JikanListResponse<JikanAnimeData> response = jikanIntegrationService.getSeasonalAnime(page);
        return mapToPageResponse(response);
    }

    /**
     * Retrieves seasonal anime for a specific year and season.
     * The results are cached.
     *
     * @param year   The year of the season.
     * @param season The season (e.g., "winter", "spring", "summer", "fall").
     * @param page   The page number of the results.
     * @return A paginated response of seasonal anime DTOs.
     * @sampleCacheKey animeSeasonal::2023:winter:1
     * @see Cacheable
     */
    @Cacheable(value = "animeSeasonal", key = "#year + ':' + #season + ':' + #page")
    public PageResponse<AnimeDto> getSeasonalAnime(int year, String season, int page) {
        log.debug("Fetching seasonal anime for year: {}, season: {}, page: {}", year, season, page);
        JikanListResponse<JikanAnimeData> response = jikanIntegrationService.getSeasonalAnime(year, season, page);
        return mapToPageResponse(response);
    }

    /**
     * Retrieves the archive of anime seasons.
     * The result is cached.
     *
     * @return A list of season archive DTOs.
     * @sampleCacheKey animeSeasonArchive::SimpleKey []
     * @see Cacheable
     */
    @Cacheable(value = "animeSeasonArchive")
    public List<SeasonArchiveDto> getSeasonArchive() {
        log.debug("Fetching season archive");
        JikanSeasonArchiveResponse response = jikanIntegrationService.getSeasonArchive();
        List<JikanSeasonArchiveResponse.SeasonArchiveData> filteredData = response.getData().stream()
                .filter(s -> s.getYear() != null && s.getYear() >= 2000)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .toList();

        return animeMapper.toSeasonArchiveDtoList(filteredData);
    }

    /**
     * Retrieves the characters of a specific anime.
     * The results are cached.
     *
     * @param id The ID of the anime.
     * @return A list of anime character DTOs.
     * @sampleCacheKey animeCharacters::1
     * @see Cacheable
     */
    @Cacheable(value = "animeCharacters", key = "#id")
    public List<AnimeCharacterDto> getAnimeCharacters(int id) {
        log.debug("Fetching characters for anime id: {}", id);
        JikanCharactersResponse response = jikanIntegrationService.getAnimeCharacters(id);
        return animeMapper.toCharacterDtoList(response.getData());
    }

    /**
     * Maps a Jikan list response to a paginated response of anime DTOs.
     *
     * @param response The Jikan list response.
     * @return A paginated response of anime DTOs.
     */
    private PageResponse<AnimeDto> mapToPageResponse(JikanListResponse<JikanAnimeData> response) {
        List<AnimeDto> dtos = response.getData().stream()
                .map(animeMapper::toDto)
                .toList();

        return PageResponse.toPageResponseFromJikan(response, dtos);
    }


    /**
     * Searches for characters based on a query.
     * The results are cached.
     *
     * @param query The search query.
     * @param page  The page number of the search results.
     * @return A paginated response of character DTOs.
     * @sampleCacheKey characterSearch::naruto:1
     * @see Cacheable
     */
    @Cacheable(value = "characterSearch", key = "#query + ':' + #page")
    public PageResponse<CharacterDto> searchCharacters(String query, int page) {
        log.debug("Searching characters with query: {}, page: {}", query, page);
        JikanListResponse<JikanCharacterData> response = jikanIntegrationService.searchCharacters(query, page);

        List<CharacterDto> dtos = response.getData().stream()
                .map(c -> CharacterDto.builder()
                        .malId(c.getMalId())
                        .name(c.getName())
                        .imageUrl(c.getImages().getJpg().getImageUrl())
                        .about(c.getAbout())
                        .favorites(c.getFavorites())
                        .build())
                .toList();

        return PageResponse.toPageResponseFromJikan(response, dtos);
    }
}
