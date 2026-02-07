package com.otaku.community.feature.feedback.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.feedback.dto.FeedbackRequestDto;
import com.otaku.community.feature.feedback.dto.FeedbackResponseDto;
import com.otaku.community.feature.feedback.dto.FeedbackUpdateDto;
import com.otaku.community.feature.feedback.entity.Feedback;
import com.otaku.community.feature.feedback.entity.FeedbackStatus;
import com.otaku.community.feature.feedback.mapper.FeedbackMapper;
import com.otaku.community.feature.feedback.repository.FeedbackRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;
    private final UserRepository userRepository;

    @Transactional
    public FeedbackResponseDto createFeedback(FeedbackRequestDto dto, UUID userId) {
        Feedback feedback = feedbackMapper.toEntity(dto);

        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            feedback.setReporter(user);
        }

        feedback.setStatus(FeedbackStatus.NEW);
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(savedFeedback);
    }

    public PageResponse<FeedbackResponseDto> getFeedbacks(FeedbackStatus status, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Feedback> feedbacksPage;
        if (status != null) {
            feedbacksPage = feedbackRepository.findByStatus(status, pageable);
        } else {
            feedbacksPage = feedbackRepository.findAll(pageable);
        }

        return PageResponse.of(
                feedbacksPage.getContent().stream().map(feedbackMapper::toDto).toList(),
                page,
                limit,
                feedbacksPage.getTotalElements());
    }

    @Transactional
    public FeedbackResponseDto updateFeedbackStatus(UUID feedbackId, FeedbackUpdateDto dto, UUID moderatorId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new RuntimeException("Moderator not found"));

        if (dto.getStatus() != null) {
            feedback.setStatus(dto.getStatus());
        }
        if (dto.getPriority() != null) {
            feedback.setPriority(dto.getPriority());
        }
        if (dto.getModeratorNotes() != null) {
            feedback.setModeratorNotes(dto.getModeratorNotes());
        }

        feedback.setModerator(moderator);
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(savedFeedback);
    }

    public FeedbackResponseDto getFeedback(UUID feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        return feedbackMapper.toDto(feedback);
    }

    public long countFeedbacksByStatus(FeedbackStatus status) {
        return feedbackRepository.countByStatus(status);
    }

    @Transactional
    public void resolveFeedback(UUID feedbackId, FeedbackStatus status, String notes, UUID moderatorId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new RuntimeException("Moderator not found"));

        feedback.setStatus(status);
        feedback.setModeratorNotes(notes);
        feedback.setModerator(moderator);
        feedbackRepository.save(feedback);
    }
}
