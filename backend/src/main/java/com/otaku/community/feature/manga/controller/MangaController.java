package com.otaku.community.feature.manga.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.manga.dto.chapter.ChapterResponse;
import com.otaku.community.feature.manga.dto.manga.MangaDto;
import com.otaku.community.feature.manga.service.MangaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/manga")
@RequiredArgsConstructor
@Tag(name = "Manga", description = "Manga management APIs")
public class MangaController {

    private final MangaService mangaService;

    @GetMapping("/search")
    @Operation(summary = "Search manga", description = "Search manga by keyword, type, and status")
    public ResponseEntity<ApiResponse<PageResponse<MangaDto>>> searchManga(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page) {
        PageResponse<MangaDto> response = mangaService.searchManga(q, type, status, page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get manga details", description = "Get manga details by ID")
    public ResponseEntity<ApiResponse<MangaDto>> getMangaById(@PathVariable int id) {
        MangaDto response = mangaService.getMangaById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/top")
    @Operation(summary = "Get top manga", description = "Get top manga list")
    public ResponseEntity<ApiResponse<PageResponse<MangaDto>>> getTopManga(@RequestParam(defaultValue = "1") int page) {
        PageResponse<MangaDto> response = mangaService.getTopManga(page);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/chapters")
    @Operation(summary = "Get manga chapters", description = "Get chapters for a manga by its internal ID")
    public ResponseEntity<ApiResponse<List<ChapterResponse>>> getChapters(@PathVariable UUID id) {
        List<ChapterResponse> response = mangaService.getChapters(id).stream()
                .map(chapter -> ChapterResponse.builder()
                        .id(chapter.getId())
                        .chapterNumber(chapter.getChapterNumber())
                        .title(chapter.getTitle())
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/sync/{malId}")
    @Operation(summary = "Sync manga from Jikan", description = "Ensure a manga exists locally by its malId")
    public ResponseEntity<ApiResponse<MangaDto>> syncManga(@PathVariable int malId) {
        mangaService.getOrCreateManga(malId);
        MangaDto response = mangaService.getMangaById(malId);
        return ResponseEntity.ok(ApiResponse.success("Manga synced successfully", response));
    }

    @PostMapping("/{id}/chapters/ensure")
    @Operation(summary = "Ensure chapter exists", description = "Find or create a chapter by its number")
    public ResponseEntity<ApiResponse<ChapterResponse>> ensureChapter(
            @PathVariable UUID id,
            @RequestParam BigDecimal chapterNumber,
            @RequestParam(required = false) String title) {
        var chapter = mangaService.getOrCreateChapter(id, chapterNumber,
                title != null ? title : "Chapter " + chapterNumber);
        ChapterResponse response = ChapterResponse.builder()
                .id(chapter.getId())
                .chapterNumber(chapter.getChapterNumber())
                .title(chapter.getTitle())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Chapter ensured successfully", response));
    }
}
