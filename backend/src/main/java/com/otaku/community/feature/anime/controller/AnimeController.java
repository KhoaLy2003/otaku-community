package com.otaku.community.feature.anime.controller;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.anime.dto.AnimeDto;
import com.otaku.community.feature.anime.dto.CharacterDto;
import com.otaku.community.feature.anime.dto.SeasonArchiveDto;
import com.otaku.community.feature.anime.service.AnimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
    public PageResponse<AnimeDto> searchAnime(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page) {
        return animeService.searchAnime(q, type, status, page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get anime details", description = "Get anime details by ID")
    public AnimeDto getAnimeById(@PathVariable int id) {
        return animeService.getAnimeById(id);
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending anime", description = "Get currently trending/airing anime")
    public PageResponse<AnimeDto> getTrendingAnime(@RequestParam(defaultValue = "1") int page) {
        return animeService.getTrendingAnime(page);
    }

    @GetMapping("/seasonal")
    @Operation(summary = "Get seasonal anime", description = "Get current seasonal anime")
    public PageResponse<AnimeDto> getSeasonalAnime(@RequestParam(defaultValue = "1") int page) {
        return animeService.getSeasonalAnime(page);
    }

    @GetMapping("/seasons")
    @Operation(summary = "Get season archive", description = "Get list of available years and seasons")
    public List<SeasonArchiveDto> getSeasonArchive() {
        return animeService.getSeasonArchive();
    }

    @GetMapping("/seasons/{year}/{season}")
    @Operation(summary = "Get seasonal anime by year and season", description = "Get anime list for a specific year and season")
    public PageResponse<AnimeDto> getSeasonalAnimeByYearAndSeason(
            @PathVariable int year,
            @PathVariable String season,
            @RequestParam(defaultValue = "1") int page) {
        return animeService.getSeasonalAnime(year, season, page);
    }

    @GetMapping("/characters/search")
    @Operation(summary = "Search characters", description = "Search characters by name")
    public PageResponse<CharacterDto> searchCharacters(
            @RequestParam String q,
            @RequestParam(defaultValue = "1") int page) {
        return animeService.searchCharacters(q, page);
    }
}
