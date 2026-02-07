package com.otaku.community.feature.news.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RssFeedTestResult {
    private boolean success;
    private String title;
    private String description;
    private Integer itemCount;
    private List<String> sampleTitles;
    private String error;
}
