package com.otaku.community.feature.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {

    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String color;
    private Boolean isDefault;
    private Long postsCount;
    private Instant createdAt;
    private Instant updatedAt;
}