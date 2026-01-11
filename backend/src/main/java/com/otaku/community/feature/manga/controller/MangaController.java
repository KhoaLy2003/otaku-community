package com.otaku.community.feature.manga.controller;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.manga.dto.MangaDto;
import com.otaku.community.feature.manga.service.MangaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/manga")
@RequiredArgsConstructor
@Tag(name = "Manga", description = "Manga management APIs")
public class MangaController {

    private final MangaService mangaService;

    @GetMapping("/search")
    @Operation(summary = "Search manga", description = "Search manga by keyword, type, and status")
    public PageResponse<MangaDto> searchManga(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page) {
        return mangaService.searchManga(q, type, status, page);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get manga details", description = "Get manga details by ID")
    public MangaDto getMangaById(@PathVariable int id) {
        return mangaService.getMangaById(id);
    }

    @GetMapping("/top")
    @Operation(summary = "Get top manga", description = "Get top manga list")
    public PageResponse<MangaDto> getTopManga(@RequestParam(defaultValue = "1") int page) {
        return mangaService.getTopManga(page);
    }
}
