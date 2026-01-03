package com.otaku.community.feature.user.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.BadRequestException;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.service.ActivityService;
import com.otaku.community.feature.feed.service.FeedService;
import com.otaku.community.feature.notification.entity.Notification;
import com.otaku.community.feature.notification.listener.NotificationEventListener;
import com.otaku.community.feature.user.dto.UserSummaryDto;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.entity.UserFollow;
import com.otaku.community.feature.user.repository.UserFollowRepository;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserFollowService {

    private final UserFollowRepository userFollowRepository;
    private final UserRepository userRepository;
    private final FeedService feedService;
    private final ApplicationEventPublisher eventPublisher;
    private final ActivityService activityService;

    public void followUser(UUID followerId, UUID followedId) {
        if (followerId.equals(followedId)) {
            throw new BadRequestException("You cannot follow yourself");
        }

        User followedUser = userRepository.findById(followedId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followedId));

        if (followedUser.getProfileVisibility() == com.otaku.community.feature.user.entity.ProfileVisibility.PRIVATE) {
            throw new BadRequestException("This account is private and cannot be followed.");
        }

        if (userFollowRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            log.debug("User {} is already following {}", followerId, followedId);
            return;
        }

        UserFollow follow = UserFollow.builder()
                .followerId(followerId)
                .followedId(followedId)
                .build();

        userFollowRepository.save(follow);
        log.debug("User {} followed {}", followerId, followedId);

        // Log Activity
        User follower = userRepository.findById(followerId).orElse(null);
        if (follower != null) {
            activityService.logActivity(follower, ActivityType.FOLLOW_USER, "Followed User ID: " + followedId);
        }

        // Trigger Feed Backfill
        feedService.backfillFeed(followerId, followedId);

        // Publish Notification Event
        eventPublisher.publishEvent(
                new NotificationEventListener.NotificationEvent(
                        followedId,
                        followerId,
                        Notification.NotificationType.FOLLOW,
                        followerId,
                        Notification.TargetType.USER,
                        "started following you"));
    }

    public void unfollowUser(UUID followerId, UUID followedId) {
        if (!userFollowRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            // Idempotent: if not following, consider it done
            return;
        }

        userFollowRepository.deleteByFollowerIdAndFollowedId(followerId, followedId);
        log.debug("User {} unfollowed {}", followerId, followedId);

        // Log Activity
        userRepository.findById(followerId).ifPresent(follower -> activityService.logActivity(
                follower, ActivityType.UNFOLLOW_USER, "Unfollowed User ID: " + followedId));

        // Trigger Feed Cleanup
        feedService.removeFeedEntries(followerId, followedId);

        // Publish Notification Event
        eventPublisher.publishEvent(
                new NotificationEventListener.NotificationEvent(
                        followedId,
                        followerId,
                        Notification.NotificationType.UNFOLLOW,
                        followerId,
                        Notification.TargetType.USER,
                        "unfollowed you"));
    }

    @Transactional(readOnly = true)
    public long getFollowersCount(UUID userId) {
        return userFollowRepository.countByFollowedId(userId);
    }

    @Transactional(readOnly = true)
    public long getFollowingCount(UUID userId) {
        return userFollowRepository.countByFollowerId(userId);
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(UUID followerId, UUID followedId) {
        return userFollowRepository.existsByFollowerIdAndFollowedId(followerId, followedId);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryDto> getFollowersWithStatus(UUID targetUserId, UUID currentUserId,
                                                               int page, int limit) {
        // 1. Get the page of followers
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<UserFollow> followsPage = userFollowRepository.findAllByFollowedId(targetUserId, pageable);

        if (followsPage.isEmpty()) {
            return null;
        }

        // 2. Extract IDs of the followers
        List<UUID> followerIds = followsPage.getContent().stream()
                .map(UserFollow::getFollowerId)
                .toList();

        return getUsersWithStatus(followerIds, currentUserId, page, limit, followsPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryDto> getFollowingWithStatus(
            UUID targetUserId, UUID currentUserId,
            int page, int limit) {
        // 1. Get the page of followed users
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<UserFollow> followsPage = userFollowRepository.findAllByFollowerId(targetUserId, pageable);

        if (followsPage.isEmpty()) {
            return null;
        }

        // 2. Extract IDs of the followed users
        List<UUID> followedIds = followsPage.getContent().stream()
                .map(UserFollow::getFollowedId)
                .toList();

        return getUsersWithStatus(followedIds, currentUserId, page, limit, followsPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryDto> getUsersWithStatus(List<UUID> userIds, UUID currentUserId,
                                                           int page, int limit, long totalElements) {
        if (userIds.isEmpty()) {
            return PageResponse.of(Collections.emptyList(), page, limit, totalElements);
        }

        // 3. Fetch User entities
        Map<UUID, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // 4. Determine context (am I following them?)
        Set<UUID> currentlyFollowingIds;
        if (currentUserId != null) {
            currentlyFollowingIds = userFollowRepository.findFollowedIdsByFollowerIdAndFollowedIdsIn(currentUserId,
                    userIds);
        } else {
            currentlyFollowingIds = Collections.emptySet();
        }

        // 5. Map to DTO, preserving order of the original list
        List<UserSummaryDto> content = userIds.stream()
                .map(id -> {
                    User user = userMap.get(id);
                    if (user == null)
                        return null; // Should not happen if data is consistent

                    return UserSummaryDto.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .avatarUrl(user.getAvatarUrl())
                            .bio(user.getBio())
                            .isFollowing(currentlyFollowingIds.contains(user.getId()))
                            .profileVisibility(user.getProfileVisibility())
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();

        return PageResponse.of(content, page, limit, totalElements);
    }
}
