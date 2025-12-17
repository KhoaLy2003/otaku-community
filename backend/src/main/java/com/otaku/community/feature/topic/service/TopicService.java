package com.otaku.community.feature.topic.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ConflictException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.topic.dto.TopicRequest;
import com.otaku.community.feature.topic.dto.TopicResponse;
import com.otaku.community.feature.topic.dto.UpdateTopicRequest;
import com.otaku.community.feature.topic.entity.Topic;
import com.otaku.community.feature.topic.entity.PostTopic;
import com.otaku.community.feature.topic.mapper.TopicMapper;
import com.otaku.community.feature.topic.repository.TopicRepository;
import com.otaku.community.feature.topic.repository.PostTopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final PostTopicRepository postTopicRepository;
    private final TopicMapper topicMapper;

    @Transactional
    public TopicResponse createTopic(TopicRequest request) {
        validateTopicRequest(request);

        // Check for name uniqueness
        if (topicRepository.existsByNameAndNotDeleted(request.getName())) {
            throw new ConflictException("Topic with name '" + request.getName() + "' already exists");
        }

        // Check for slug uniqueness
        String slug = Topic.generateSlug(request.getName());
        if (topicRepository.existsBySlugAndNotDeleted(slug)) {
            throw new ConflictException("Topic with slug '" + slug + "' already exists");
        }

        Topic topic = topicMapper.toEntity(request);
        Topic savedTopic = topicRepository.save(topic);

        log.info("Topic created: {} with slug: {}", savedTopic.getName(), savedTopic.getSlug());
        return topicMapper.toResponse(savedTopic);
    }

    @Transactional(readOnly = true)
    public TopicResponse getTopicById(UUID topicId) {
        Topic topic = topicRepository.findByIdAndNotDeleted(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", topicId));

        Long postsCount = postTopicRepository.countPostsByTopicId(topicId);
        return topicMapper.toResponseWithPostsCount(topic, postsCount);
    }

    @Transactional(readOnly = true)
    public TopicResponse getTopicBySlug(String slug) {
        Topic topic = topicRepository.findBySlugAndNotDeleted(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "slug", slug));

        Long postsCount = postTopicRepository.countPostsByTopicId(topic.getId());
        return topicMapper.toResponseWithPostsCount(topic, postsCount);
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getAllTopics() {
        List<Topic> topics = topicRepository.findAllActiveTopics();
        return topics.stream()
                .map(topic -> {
                    Long postsCount = postTopicRepository.countPostsByTopicId(topic.getId());
                    return topicMapper.toResponseWithPostsCount(topic, postsCount);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getDefaultTopics() {
        List<Topic> topics = topicRepository.findDefaultTopics();
        return topics.stream()
                .map(topicMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<TopicResponse> searchTopics(String query, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Topic> topicPage = topicRepository.searchByName(query, pageable);

        List<TopicResponse> responses = topicPage.getContent().stream()
                .map(topic -> {
                    Long postsCount = postTopicRepository.countPostsByTopicId(topic.getId());
                    return topicMapper.toResponseWithPostsCount(topic, postsCount);
                })
                .toList();

        return PageResponse.of(responses, page, limit, topicPage.getTotalElements());
    }

    @Transactional
    public TopicResponse updateTopic(UUID topicId, UpdateTopicRequest request) {
        Topic topic = topicRepository.findByIdAndNotDeleted(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", topicId));

        // Validate color if provided
        if (request.getColor() != null && !request.getColor().matches("^#[0-9A-Fa-f]{6}$")) {
            throw new BadRequestException("Color must be a valid hex color (e.g., #FF5733)");
        }

        // Check name uniqueness if changed
        if (request.getName() != null && !request.getName().equals(topic.getName())) {
            if (topicRepository.existsByNameAndNotDeletedExcludingId(request.getName(), topicId)) {
                throw new ConflictException("Topic with name '" + request.getName() + "' already exists");
            }
        }

        // Update fields
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

        Topic savedTopic = topicRepository.save(topic);
        log.info("Topic updated: {}", savedTopic.getId());

        Long postsCount = postTopicRepository.countPostsByTopicId(topicId);
        return topicMapper.toResponseWithPostsCount(savedTopic, postsCount);
    }

    @Transactional
    public void deleteTopic(UUID topicId) {
        Topic topic = topicRepository.findByIdAndNotDeleted(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", topicId));

        // Soft delete the topic
        topic.softDelete();
        topicRepository.save(topic);

        // Remove all post-topic associations
        postTopicRepository.deleteByTopicId(topicId);

        log.info("Topic deleted: {}", topicId);
    }

    @Transactional
    public void associatePostWithTopics(Post post, Set<UUID> topicIds) {
        if (topicIds == null || topicIds.isEmpty()) {
            return;
        }

        List<Topic> topics = topicRepository.findAllById(topicIds);

        if (topics.size() != topicIds.size()) {
            throw new BadRequestException("Invalid topic id(s)");
        }

        topics.forEach(post::addTopic);
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getTopicsByPostId(UUID postId) {
        List<UUID> topicIds = postTopicRepository.findTopicIdsByPostId(postId);
        if (topicIds.isEmpty()) {
            return List.of();
        }

        List<Topic> topics = topicRepository.findByIdsAndNotDeleted(topicIds);
        return topics.stream()
                .map(topicMapper::toResponse)
                .toList();
    }

    private void validateTopicRequest(TopicRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Topic name is required");
        }

        if (request.getName().length() > 100) {
            throw new BadRequestException("Topic name cannot exceed 100 characters");
        }

        if (request.getDescription() != null && request.getDescription().length() > 500) {
            throw new BadRequestException("Description cannot exceed 500 characters");
        }

        if (request.getColor() != null && !request.getColor().matches("^#[0-9A-Fa-f]{6}$")) {
            throw new BadRequestException("Color must be a valid hex color (e.g., #FF5733)");
        }
    }
}