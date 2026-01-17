package com.otaku.community.feature.integration.jikan;

import com.otaku.community.common.exception.JikanIntegrationException;
import com.otaku.community.feature.integration.jikan.dto.JikanAnimeData;
import com.otaku.community.feature.integration.jikan.dto.JikanCharacterData;
import com.otaku.community.feature.integration.jikan.dto.JikanCharactersResponse;
import com.otaku.community.feature.integration.jikan.dto.JikanListResponse;
import com.otaku.community.feature.integration.jikan.dto.JikanSeasonArchiveResponse;
import com.otaku.community.feature.integration.jikan.dto.JikanSingleResponse;
import com.otaku.community.feature.manga.integration.dto.JikanMangaData;
import com.otaku.community.feature.manga.integration.dto.JikanMangaSingleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
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

    public JikanListResponse<JikanAnimeData> searchAnime(String query, String type, String status, int page) {
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
        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Search Anime", "Failed to fetch anime from Jikan");
    }

    public JikanSingleResponse getAnimeById(int id) {
        String url = BASE_URL + "/anime/" + id;
        return getFromJikan(url, JikanSingleResponse.class, "Anime by ID", "Failed to fetch anime details from Jikan");
    }

    public JikanListResponse<JikanAnimeData> getTopAnime(String filter, int page) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/top/anime")
                .queryParam("page", page);

        if (filter != null && !filter.isBlank()) {
            builder.queryParam("filter", filter);
        }

        String url = builder.build().toUriString();
        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Top Anime", "Failed to fetch top anime from Jikan");
    }

    public JikanListResponse<JikanAnimeData> getSeasonalAnime(int page) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/seasons/now")
                .queryParam("page", page)
                .build().toUriString();

        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Seasonal Anime", "Failed to fetch seasonal anime from Jikan");
    }

    public JikanListResponse<JikanAnimeData> getSeasonalAnime(int year, String season, int page) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL + "/seasons/" + year + "/" + season)
                .queryParam("page", page)
                .build().toUriString();

        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Seasonal Anime by year and season", "Failed to fetch seasonal anime from Jikan");
    }

    public JikanSeasonArchiveResponse getSeasonArchive() {
        String url = BASE_URL + "/seasons";
        return getFromJikan(url, JikanSeasonArchiveResponse.class, "Season Archive", "Failed to fetch season archive from Jikan");
    }

    public JikanListResponse<JikanMangaData> searchManga(String query, String type, String status, int page) {
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
        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Search Manga", "Failed to fetch manga from Jikan");
    }

    public JikanMangaSingleResponse getMangaById(int id) {
        String url = BASE_URL + "/manga/" + id;
        return getFromJikan(url, JikanMangaSingleResponse.class, "Manga by ID", "Failed to fetch manga details from Jikan");
    }

    public JikanListResponse<JikanMangaData> getTopManga(int page) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/top/manga")
                .queryParam("page", page)
                .queryParam("limit", 20)
                .build().toUriString();

        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Top Manga", "Failed to fetch top manga from Jikan");
    }

    public JikanCharactersResponse getAnimeCharacters(int id) {
        String url = BASE_URL + "/anime/" + id + "/characters";
        return getFromJikan(url, JikanCharactersResponse.class, "Anime Characters", "Failed to fetch anime characters from Jikan");
    }

    public JikanListResponse<JikanCharacterData> searchCharacters(String query, int page) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/characters")
                .queryParam("page", page)
                .queryParam("limit", 20);

        if (query != null && !query.isBlank()) {
            builder.queryParam("q", query);
        }

        String url = builder.build().toUriString();
        return getFromJikan(url, new ParameterizedTypeReference<>() {
        }, "Search Characters", "Failed to fetch characters from Jikan");
    }

    private <T> T getFromJikan(String url, ParameterizedTypeReference<T> responseType, String apiName, String failureMessage) {
        try {
            log.debug("Calling Jikan {} API: {}", apiName, url);
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, null, responseType);
            return response.getBody();
        } catch (RestClientException e) {
            log.error("Error calling Jikan {} API with url {}", apiName, url, e);
            throw new JikanIntegrationException(failureMessage, e);
        }
    }

    private <T> T getFromJikan(String url, Class<T> responseClass, String apiName, String failureMessage) {
        try {
            log.debug("Calling Jikan {} API: {}", apiName, url);
            return restTemplate.getForObject(url, responseClass);
        } catch (RestClientException e) {
            log.error("Error calling Jikan {} API with url {}", apiName, url, e);
            throw new JikanIntegrationException(failureMessage, e);
        }
    }
}
