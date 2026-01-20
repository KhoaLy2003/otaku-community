package com.otaku.community.feature.anime.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.anime.dto.AnimeDto;
import com.otaku.community.feature.anime.dto.CharacterDto;
import com.otaku.community.feature.anime.dto.SeasonArchiveDto;
import com.otaku.community.feature.anime.service.AnimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/anime")
@RequiredArgsConstructor
@Tag(name = "Anime", description = "Anime management APIs")
public class AnimeController {

    private final AnimeService animeService;

    @GetMapping("/search")
    @Operation(summary = "Search anime", description = "Search anime by keyword, type, and status")
    public ResponseEntity<ApiResponse<PageResponse<AnimeDto>>> searchAnime(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page) {
        PageResponse<AnimeDto> response = animeService.searchAnime(q, type, status, page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get anime details", description = "Get anime details by ID")
    public ResponseEntity<ApiResponse<AnimeDto>> getAnimeById(@PathVariable int id) {
        AnimeDto response = animeService.getAnimeById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending anime", description = "Get currently trending/airing anime")
    public ResponseEntity<ApiResponse<PageResponse<AnimeDto>>> getTrendingAnime(
            @RequestParam(defaultValue = "1") int page) {
        PageResponse<AnimeDto> response = animeService.getTrendingAnime(page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/seasonal")
    @Operation(summary = "Get seasonal anime", description = "Get current seasonal anime")
    public ResponseEntity<ApiResponse<PageResponse<AnimeDto>>> getSeasonalAnime(
            @RequestParam(defaultValue = "1") int page) {
        PageResponse<AnimeDto> response = animeService.getSeasonalAnime(page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/seasons")
    @Operation(summary = "Get season archive", description = "Get list of available years and seasons")
    public ResponseEntity<ApiResponse<List<SeasonArchiveDto>>> getSeasonArchive() {
        List<SeasonArchiveDto> response = animeService.getSeasonArchive();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/seasons/{year}/{season}")
    @Operation(summary = "Get seasonal anime by year and season", description = "Get anime list for a specific year and season")
    public ResponseEntity<ApiResponse<PageResponse<AnimeDto>>> getSeasonalAnimeByYearAndSeason(
            @PathVariable int year,
            @PathVariable String season,
            @RequestParam(defaultValue = "1") int page) {
        PageResponse<AnimeDto> response = animeService.getSeasonalAnime(year, season, page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/characters/search")
    @Operation(summary = "Search characters", description = "Search characters by name")
    public ResponseEntity<ApiResponse<PageResponse<CharacterDto>>> searchCharacters(
            @RequestParam String q,
            @RequestParam(defaultValue = "1") int page) {
        PageResponse<CharacterDto> response = animeService.searchCharacters(q, page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
