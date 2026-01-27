package com.otaku.community.feature.manga.service;

import com.otaku.community.feature.manga.dto.translation.TranslatorRankingResponse;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final UserRepository userRepository;

    public List<TranslatorRankingResponse> getTranslatorRankings(String period, int limit) {
        Instant since;
        if ("weekly".equalsIgnoreCase(period)) {
            since = Instant.now().minus(7, ChronoUnit.DAYS);
        } else if ("monthly".equalsIgnoreCase(period)) {
            since = Instant.now().minus(30, ChronoUnit.DAYS);
        } else {
            // All-time
            return getAllTimeRankings(limit);
        }

        List<Object[]> results = userRepository.findTranslatorsByStatsInPeriod(since, PageRequest.of(0, limit));
        return mapToResponse(results, false);
    }

    private List<TranslatorRankingResponse> getAllTimeRankings(int limit) {
        List<Object[]> results = userRepository.findAllTimeTranslators(PageRequest.of(0, limit));
        return mapToResponse(results, true);
    }

    public Integer getUserRank(UUID userId) {
        return userRepository.findUserRank(userId).orElse(null);
    }

    private List<TranslatorRankingResponse> mapToResponse(List<Object[]> results, boolean isAllTime) {
        List<TranslatorRankingResponse> response = new ArrayList<>();
        int rank = 1;
        for (Object[] row : results) {
            long views = (row[4] != null) ? ((Number) row[4]).longValue() : 0L;
            long likes = (row[5] != null) ? ((Number) row[5]).longValue() : 0L;
            long comments = 0L;
            long translations;

            if (isAllTime) {
                translations = (row[6] != null) ? ((Number) row[6]).longValue() : 0L;
            } else {
                comments = (row[6] != null) ? ((Number) row[6]).longValue() : 0L;
                translations = (row[7] != null) ? ((Number) row[7]).longValue() : 0L;
            }

            double score = (likes * 10.0) + views + (comments * 5.0);

            response.add(TranslatorRankingResponse.builder()
                    .userId((UUID) row[0])
                    .username((String) row[1])
                    .avatarUrl((String) row[2])
                    .groupName((String) row[3])
                    .totalViews(views)
                    .totalLikes(likes)
                    .totalComments(comments)
                    .totalTranslations(translations)
                    .score(score)
                    .rank(rank++)
                    .build());
        }
        return response;
    }
}
