package com.otaku.community.feature.manga.controller;

import com.otaku.community.common.dto.ApiResponse;
import com.otaku.community.feature.manga.dto.translation.TranslatorRankingResponse;
import com.otaku.community.feature.manga.service.RankingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rankings")
@RequiredArgsConstructor
@Tag(name = "Ranking", description = "Translator ranking APIs")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/translators")
    @Operation(summary = "Get translator rankings", description = "Get top translators based on engagement metrics")
    public ResponseEntity<ApiResponse<List<TranslatorRankingResponse>>> getTranslatorRankings(
            @RequestParam(defaultValue = "all-time") String period,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(rankingService.getTranslatorRankings(period, limit)));
    }
}
