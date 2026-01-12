package com.otaku.community.feature.anime.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.anime.dto.AnimeCharacterDto;
import com.otaku.community.feature.anime.dto.AnimeDto;
import com.otaku.community.feature.anime.dto.SeasonArchiveDto;
import com.otaku.community.feature.anime.integration.JikanIntegrationService;
import com.otaku.community.feature.anime.integration.dto.JikanCharactersResponse;
import com.otaku.community.feature.anime.integration.dto.JikanListResponse;
import com.otaku.community.feature.anime.integration.dto.JikanSeasonArchiveResponse;
import com.otaku.community.feature.anime.integration.dto.JikanSingleResponse;
import com.otaku.community.feature.anime.mapper.AnimeMapper;
import com.otaku.community.feature.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnimeService {

    private final JikanIntegrationService jikanIntegrationService;
    private final AnimeMapper animeMapper;
    private final PostService postService;

    public PageResponse<AnimeDto> searchAnime(String query, String type, String status, int page) {
        log.debug("Searching anime with query: {}, type: {}, status: {}, page: {}", query, type, status, page);
        JikanListResponse response = jikanIntegrationService.searchAnime(query, type, status, page);
        return mapToPageResponse(response);
    }

    public AnimeDto getAnimeById(int id) {
        log.debug("Fetching anime details for id: {}", id);
        JikanSingleResponse response = jikanIntegrationService.getAnimeById(id);
        if (response.getData() == null) {
            throw new RuntimeException("Anime not found with id: " + id);
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

    public PageResponse<AnimeDto> getTrendingAnime(int page) {
        log.debug("Fetching trending anime for page: {}", page);
        // Using "airing" filter for trending
        JikanListResponse response = jikanIntegrationService.getTopAnime("airing", page);
        return mapToPageResponse(response);
    }

    public PageResponse<AnimeDto> getSeasonalAnime(int page) {
        log.debug("Fetching seasonal anime for page: {}", page);
        JikanListResponse response = jikanIntegrationService.getSeasonalAnime(page);
        return mapToPageResponse(response);
    }

    public PageResponse<AnimeDto> getSeasonalAnime(int year, String season, int page) {
        log.debug("Fetching seasonal anime for year: {}, season: {}, page: {}", year, season, page);
        JikanListResponse response = jikanIntegrationService.getSeasonalAnime(year, season, page);
        return mapToPageResponse(response);
    }

    public List<SeasonArchiveDto> getSeasonArchive() {
        log.debug("Fetching season archive");
        JikanSeasonArchiveResponse response = jikanIntegrationService.getSeasonArchive();
        List<JikanSeasonArchiveResponse.SeasonArchiveData> filteredData = response.getData().stream()
                .filter(s -> s.getYear() != null && s.getYear() >= 2000)
                .sorted((a, b) -> b.getYear().compareTo(a.getYear()))
                .toList();

        return animeMapper.toSeasonArchiveDtoList(filteredData);
    }

    public List<AnimeCharacterDto> getAnimeCharacters(int id) {
        log.debug("Fetching characters for anime id: {}", id);
        JikanCharactersResponse response = jikanIntegrationService.getAnimeCharacters(id);
        return animeMapper.toCharacterDtoList(response.getData());
    }

    private PageResponse<AnimeDto> mapToPageResponse(JikanListResponse response) {

        List<AnimeDto> dtos = response.getData().stream()
                .map(animeMapper::toDto)
                .toList();

        JikanListResponse.JikanPagination pagination = response.getPagination();
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
