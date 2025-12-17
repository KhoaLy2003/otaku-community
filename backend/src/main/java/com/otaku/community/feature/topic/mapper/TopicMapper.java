package com.otaku.community.feature.topic.mapper;

import com.otaku.community.feature.topic.dto.TopicRequest;
import com.otaku.community.feature.topic.dto.TopicResponse;
import com.otaku.community.feature.topic.entity.Topic;
import org.springframework.stereotype.Component;

@Component
public class TopicMapper {

    public TopicResponse toResponse(Topic topic) {
        if (topic == null) {
            return null;
        }

        return TopicResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .color(topic.getColor())
                .isDefault(topic.getIsDefault())
                .postsCount(0L) // Will be populated by service when needed
                .createdAt(topic.getCreatedAt())
                .updatedAt(topic.getUpdatedAt())
                .build();
    }

    public TopicResponse toResponseWithPostsCount(Topic topic, Long postsCount) {
        TopicResponse response = toResponse(topic);
        if (response != null) {
            response.setPostsCount(postsCount);
        }
        return response;
    }

    public Topic toEntity(TopicRequest request) {
        if (request == null) {
            return null;
        }

        Topic topic = Topic.builder()
                .name(request.getName())
                .description(request.getDescription())
                .color(request.getColor())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        // Generate slug from name
        topic.setSlug(Topic.generateSlug(request.getName()));

        return topic;
    }

    public void updateEntityFromRequest(Topic topic, TopicRequest request) {
        if (topic == null || request == null) {
            return;
        }

        if (request.getName() != null) {
            topic.setNameAndGenerateSlug(request.getName());
        }

        if (request.getDescription() != null) {
            topic.setDescription(request.getDescription());
        }

        if (request.getColor() != null) {
            topic.setColor(request.getColor());
        }

        if (request.getIsDefault() != null) {
            topic.setIsDefault(request.getIsDefault());
        }
    }
}