package com.otaku.community.feature.manga.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.manga.dto.translation.TranslationResponse;
import com.otaku.community.feature.manga.service.TranslationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chapters")
@RequiredArgsConstructor
@Tag(name = "Chapter", description = "Manga chapter management APIs")
public class ChapterController {

    private final TranslationService translationService;

    @GetMapping("/{chapterId}/translations")
    @Operation(summary = "Get translations for a chapter", description = "Get all published translations for a given chapter")
    public ResponseEntity<ApiResponse<List<TranslationResponse>>> getChapterTranslations(@PathVariable UUID chapterId) {
        List<TranslationResponse> response = translationService.getPublishedTranslations(chapterId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
