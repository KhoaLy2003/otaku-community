package com.otaku.community.feature.news.service;

import com.otaku.community.feature.news.dto.RssItemDto;
import com.otaku.community.feature.news.entity.NewsCategory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NewsCategoryClassifier {

    private static final Map<NewsCategory, List<String>> CATEGORY_KEYWORDS = Map.of(
            NewsCategory.MANGA, List.of("manga", "comic", "webtoon", "manhwa"),
            NewsCategory.GAME, List.of("game", "gaming", "playstation", "nintendo", "xbox", "pc"),
            NewsCategory.FEATURES, List.of("feature", "review", "recap", "guide", "interview"),
            NewsCategory.ANNOUNCEMENTS, List.of("announce", "reveal", "trailer", "premiere", "debut"),
            NewsCategory.INDUSTRY, List.of("industry", "studio", "production", "box office", "ranking"));

    public NewsCategory classify(RssItemDto item) {
        String text = (item.getTitle() + " " +
                (item.getSummary() != null ? item.getSummary() : "")).toLowerCase();

        // Check RSS categories first
        if (item.getCategories() != null) {
            for (String category : item.getCategories()) {
                NewsCategory mapped = mapRssCategory(category);
                if (mapped != null) {
                    return mapped;
                }
            }
        }

        // Keyword-based classification
        for (Map.Entry<NewsCategory, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) {
                    return entry.getKey();
                }
            }
        }

        // Default to ANIME
        return NewsCategory.ANIME;
    }

    private NewsCategory mapRssCategory(String rssCategory) {
        String lower = rssCategory.toLowerCase();

        if (lower.contains("manga"))
            return NewsCategory.MANGA;
        if (lower.contains("game"))
            return NewsCategory.GAME;
        if (lower.contains("feature"))
            return NewsCategory.FEATURES;
        if (lower.contains("interview"))
            return NewsCategory.INTERVIEWS;
        if (lower.contains("review"))
            return NewsCategory.REVIEWS;
        if (lower.contains("announcement"))
            return NewsCategory.ANNOUNCEMENTS;
        if (lower.contains("industry"))
            return NewsCategory.INDUSTRY;
        if (lower.contains("latest") || lower.contains("news"))
            return NewsCategory.LATEST_NEWS;

        return null;
    }
}
