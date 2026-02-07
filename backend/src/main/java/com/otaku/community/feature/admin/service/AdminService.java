package com.otaku.community.feature.admin.service;

import com.otaku.community.common.constant.CommonConstant;
import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.activity.entity.ActivityLog;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.repository.ActivityLogRepository;
import com.otaku.community.feature.admin.dto.AdminDashboardStatsDto;
import com.otaku.community.feature.admin.dto.AdminUserDetailDto;
import com.otaku.community.feature.admin.dto.AdminUserListItemDto;
import com.otaku.community.feature.admin.dto.SystemSettingsDto;
import com.otaku.community.feature.admin.entity.SystemConfig;
import com.otaku.community.feature.admin.repository.SystemConfigRepository;
import com.otaku.community.feature.feedback.dto.FeedbackResponseDto;
import com.otaku.community.feature.feedback.entity.FeedbackStatus;
import com.otaku.community.feature.feedback.service.FeedbackService;
import com.otaku.community.feature.interaction.repository.CommentRepository;
import com.otaku.community.feature.manga.entity.Translation;
import com.otaku.community.feature.manga.repository.TranslationRepository;
import com.otaku.community.feature.post.entity.Post;
import com.otaku.community.feature.post.repository.PostRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final TranslationRepository translationRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final Auth0UserService auth0UserService;
    private final FeedbackService feedbackService;

    public AdminDashboardStatsDto getDashboardStats() {
        Instant twentyFourHoursAgo = Instant.now().minus(24, ChronoUnit.HOURS);

        return AdminDashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .newUsers24h(userRepository.countByCreatedAtAfter(twentyFourHoursAgo))
                .pendingFeedbacks(feedbackService.countFeedbacksByStatus(FeedbackStatus.NEW))
                .pendingTranslations(translationRepository.countByStatus(Translation.TranslationStatus.DRAFT))
                .activePosts(postRepository.countByDeletedAtIsNull())
                .moderationActions(countModerationActions())
                .build();
    }

    public PageResponse<AdminUserListItemDto> getUsers(String query, User.UserRole role, String status,
                                                       int page, int limit) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page - 1, limit);
        Page<User> usersPage;
        if (query != null && !query.isEmpty()) {
            usersPage = userRepository.searchByUsername(query, pageable);
        } else if (role != null) {
            usersPage = userRepository.findByRole(role, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        List<AdminUserListItemDto> dtos = usersPage.getContent().stream()
                .map(user -> AdminUserListItemDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .bio(user.getBio())
                        .role(user.getRole())
                        .isLocked(user.isLocked())
                        .status(user.getStatus())
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();

        return PageResponse.of(dtos, page, limit, usersPage.getTotalElements());
    }

    @Transactional
    public void updateRole(UUID userId, User.UserRole role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));
        user.setRole(role);
        userRepository.save(user);
    }

    @Transactional
    public void banUser(UUID userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));
        user.softDelete();
        userRepository.save(user);

        auth0UserService.blockUser(user.getAuth0Id());
    }

    @Transactional
    public void unbanUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));
        user.restore();
        userRepository.save(user);

        auth0UserService.unblockUser(user.getAuth0Id());
    }

    public AdminUserDetailDto getUserDetail(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(CommonConstant.ERR_MSG_USER_NOT_FOUND));

        List<ActivityLog> recentActivities = activityLogRepository
                .findByUserIdOrderByCreatedAtDesc(userId, Pageable.ofSize(10)).getContent();

        return AdminUserDetailDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .coverImageUrl(user.getCoverImageUrl())
                .bio(user.getBio())
                .location(user.getLocation())
                .interests(user.getInterests())
                .role(user.getRole())
                .isLocked(user.isLocked())
                .status(user.getStatus())
                .totalMangaViews(user.getTotalMangaViews())
                .totalMangaUpvotes(user.getTotalMangaUpvotes())
                .totalTranslations(user.getTotalTranslations())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .recentActivities(recentActivities)
                .build();
    }

    public PageResponse<FeedbackResponseDto> getFeedbacks(FeedbackStatus status, int page, int limit) {
        return feedbackService.getFeedbacks(status, page, limit);
    }

    @Transactional
    public void resolveFeedback(UUID feedbackId, FeedbackStatus status, String notes, UUID moderatorId) {
        feedbackService.resolveFeedback(feedbackId, status, notes, moderatorId);
    }

    @Transactional
    public void moderatePost(UUID postId, boolean delete) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (delete) {
            post.softDelete();
        }
        postRepository.save(post);
    }

    @Transactional
    public void moderateComment(UUID commentId, boolean delete) {
        commentRepository.findById(commentId).ifPresent(comment -> {
            if (delete) {
                // Check if Comment has softDelete
                // For now just using delete if no soft delete method readily available
                commentRepository.delete(comment);
            }
        });
    }

    @Transactional
    public void updateTranslationStatus(UUID translationId, Translation.TranslationStatus status) {
        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new RuntimeException("Translation not found"));
        translation.setStatus(status);
        translationRepository.save(translation);
    }

    public SystemSettingsDto getSystemSettings() {
        return SystemSettingsDto.builder()
                .maintenanceMode(Boolean.parseBoolean(getConfig("MAINTENANCE_MODE", "false")))
                .allowRegistrations(Boolean.parseBoolean(getConfig("ALLOW_REGISTRATIONS", "true")))
                .maxUploadSizeMB(Integer.parseInt(getConfig("MAX_UPLOAD_SIZE_MB", "15")))
                .announcement(getConfig("ANNOUNCEMENT_TEXT", ""))
                .announcementActive(Boolean.parseBoolean(getConfig("ANNOUNCEMENT_ACTIVE", "false")))
                .build();
    }

    @Transactional
    public void updateSystemSettings(SystemSettingsDto settings) {
        setConfig("MAINTENANCE_MODE", String.valueOf(settings.isMaintenanceMode()));
        setConfig("ALLOW_REGISTRATIONS", String.valueOf(settings.isAllowRegistrations()));
        setConfig("MAX_UPLOAD_SIZE_MB", String.valueOf(settings.getMaxUploadSizeMB()));
        setConfig("ANNOUNCEMENT_TEXT", settings.getAnnouncement());
        setConfig("ANNOUNCEMENT_ACTIVE", String.valueOf(settings.isAnnouncementActive()));
    }

    private String getConfig(String key, String defaultValue) {
        return systemConfigRepository.findByKey(key)
                .map(SystemConfig::getValue)
                .orElse(defaultValue);
    }

    private void setConfig(String key, String value) {
        SystemConfig config = systemConfigRepository.findByKey(key)
                .orElse(SystemConfig.builder().key(key).build());
        config.setValue(value);
        systemConfigRepository.save(config);
    }

    private long countModerationActions() {
        List<ActivityType> moderationTypes = Arrays.asList(
                ActivityType.BAN_USER,
                ActivityType.UNBAN_USER,
                ActivityType.LOCK_USER,
                ActivityType.UNLOCK_USER,
                ActivityType.UPDATE_USER_ROLE,
                ActivityType.RESOLVE_FEEDBACK,
                ActivityType.CLOSE_FEEDBACK,
                ActivityType.MODERATE_POST,
                ActivityType.MODERATE_COMMENT,
                ActivityType.UPDATE_SYSTEM_CONFIG);
        return activityLogRepository.countByActionTypeIn(moderationTypes);
    }
}
