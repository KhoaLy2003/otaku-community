package com.otaku.community.feature.anime.integration;

import com.otaku.community.common.exception.JikanIntegrationException;
import com.otaku.community.feature.anime.integration.dto.JikanCharactersResponse;
import com.otaku.community.feature.anime.integration.dto.JikanListResponse;
import com.otaku.community.feature.anime.integration.dto.JikanSeasonArchiveResponse;
import com.otaku.community.feature.anime.integration.dto.JikanSingleResponse;
import com.otaku.community.feature.manga.integration.dto.JikanMangaListResponse;
import com.otaku.community.feature.manga.integration.dto.JikanMangaSingleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Slf4j
public class JikanIntegrationService {

    private static final String BASE_URL = "https://api.jikan.moe/v4";
    private final RestTemplate restTemplate;

    public JikanIntegrationService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public JikanListResponse searchAnime(String query, String type, String status, int page) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/anime")
                    .queryParam("page", page)
                    .queryParam("limit", 20);

            if (query != null && !query.isBlank()) {
                builder.queryParam("q", query);
            }
            if (type != null && !type.isBlank()) {
                builder.queryParam("type", type);
            }
            if (status != null && !status.isBlank()) {
                builder.queryParam("status", status);
            }

            String url = builder.build().toUriString();
            log.debug("Calling Jikan Search API: {}", url);
            return restTemplate.getForObject(url, JikanListResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Search API", e);
            throw new JikanIntegrationException("Failed to fetch anime from Jikan", e);
        }
    }

    public JikanSingleResponse getAnimeById(int id) {
        try {
            String url = BASE_URL + "/anime/" + id;
            log.debug("Calling Jikan Detail API: {}", url);
            return restTemplate.getForObject(url, JikanSingleResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Detail API for id {}", id, e);
            throw new JikanIntegrationException("Failed to fetch anime details from Jikan", e);
        }
    }

    public JikanListResponse getTopAnime(String filter, int page) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/top/anime")
                    .queryParam("page", page);

            if (filter != null && !filter.isBlank()) {
                builder.queryParam("filter", filter);
            }

            String url = builder.build().toUriString();
            log.debug("Calling Jikan Top Anime API: {}", url);
            return restTemplate.getForObject(url, JikanListResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Top Anime API", e);
            throw new JikanIntegrationException("Failed to fetch top anime from Jikan", e);
        }
    }

    public JikanListResponse getSeasonalAnime(int page) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/seasons/now")
                    .queryParam("page", page);

            String url = builder.build().toUriString();
            log.debug("Calling Jikan Seasonal API: {}", url);
            return restTemplate.getForObject(url, JikanListResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Seasonal API", e);
            throw new JikanIntegrationException("Failed to fetch seasonal anime from Jikan", e);
        }
    }

    public JikanListResponse getSeasonalAnime(int year, String season, int page) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl(BASE_URL + "/seasons/" + year + "/" + season)
                    .queryParam("page", page);

            String url = builder.build().toUriString();
            log.debug("Calling Jikan Seasonal API for {} {}: {}", year, season, url);
            return restTemplate.getForObject(url, JikanListResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Seasonal API for {} {}", year, season, e);
            throw new JikanIntegrationException("Failed to fetch seasonal anime from Jikan", e);
        }
    }

    public JikanSeasonArchiveResponse getSeasonArchive() {
        try {
            String url = BASE_URL + "/seasons";
            log.debug("Calling Jikan Season Archive API: {}", url);
            return restTemplate.getForObject(url, JikanSeasonArchiveResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Season Archive API", e);
            throw new JikanIntegrationException("Failed to fetch season archive from Jikan", e);
        }
    }

    public JikanMangaListResponse searchManga(String query, String type, String status, int page) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/manga")
                    .queryParam("page", page)
                    .queryParam("limit", 20);

            if (query != null && !query.isBlank()) {
                builder.queryParam("q", query);
            }
            if (type != null && !type.isBlank()) {
                builder.queryParam("type", type);
            }
            if (status != null && !status.isBlank()) {
                builder.queryParam("status", status);
            }

            String url = builder.build().toUriString();
            log.debug("Calling Jikan Manga Search API: {}", url);
            return restTemplate.getForObject(url, JikanMangaListResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Manga Search API", e);
            throw new JikanIntegrationException("Failed to fetch manga from Jikan", e);
        }
    }

    public JikanMangaSingleResponse getMangaById(int id) {
        try {
            String url = BASE_URL + "/manga/" + id;
            log.debug("Calling Jikan Manga Detail API: {}", url);
            return restTemplate.getForObject(url, JikanMangaSingleResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Manga Detail API for id {}", id, e);
            throw new JikanIntegrationException("Failed to fetch manga details from Jikan", e);
        }
    }

    public JikanMangaListResponse getTopManga(int page) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/top/manga")
                    .queryParam("page", page)
                    .queryParam("limit", 20);

            String url = builder.build().toUriString();
            log.debug("Calling Jikan Top Manga API: {}", url);
            return restTemplate.getForObject(url, JikanMangaListResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Top Manga API", e);
            throw new JikanIntegrationException("Failed to fetch top manga from Jikan", e);
        }
    }

    public JikanCharactersResponse getAnimeCharacters(int id) {
        try {
            String url = BASE_URL + "/anime/" + id + "/characters";
            log.debug("Calling Jikan Anime Characters API: {}", url);
            return restTemplate.getForObject(url, JikanCharactersResponse.class);
        } catch (RestClientException e) {
            log.error("Error calling Jikan Anime Characters API for id {}", id, e);
            throw new JikanIntegrationException("Failed to fetch anime characters from Jikan", e);
        }
    }
}
