package com.otaku.community.feature.feed.service;

import com.otaku.community.feature.feed.dto.FeedUpdateNotification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service for managing real-time feed updates with signal aggregation.
 * Aggregates post creation events and sends batched notifications to clients.
 * Excludes post creators from receiving their own notifications.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FeedUpdateService {

    private final SimpMessagingTemplate messagingTemplate;

    // Counter for new posts in current aggregation window
    private final AtomicInteger newPostsCounter = new AtomicInteger(0);

    // Track Auth0 IDs of users who created posts in current window (to exclude from notifications)
    private final Set<String> postCreatorAuth0IdsInWindow = ConcurrentHashMap.newKeySet();

    // Track if there are pending updates to send
    private volatile boolean hasPendingUpdates = false;

    /**
     * Called when a new post is created.
     * Increments the counter for aggregation and tracks the creator's Auth0 ID.
     *
     * @param creatorAuth0Id The Auth0 ID of the user who created the post
     */
    public void notifyNewPost(String creatorAuth0Id) {
        int count = newPostsCounter.incrementAndGet();
        postCreatorAuth0IdsInWindow.add(creatorAuth0Id);
        hasPendingUpdates = true;
        log.debug("New post created by user {}. Current aggregated count: {}", creatorAuth0Id, count);
    }

    /**
     * Scheduled task that runs every 10 seconds to send aggregated feed updates.
     * Only sends notification if there are new posts in the current window.
     * Excludes post creators from receiving notifications.
     */
    @Scheduled(fixedRate = 10000) // 10 seconds
    public void sendAggregatedFeedUpdate() {
        if (!hasPendingUpdates) {
            return; // No updates to send
        }

        int count = newPostsCounter.getAndSet(0);
        Set<String> auth0IdsToExclude = Set.copyOf(postCreatorAuth0IdsInWindow);
        postCreatorAuth0IdsInWindow.clear();
        hasPendingUpdates = false;

        if (count > 0) {
            FeedUpdateNotificationWithExclusions notification = FeedUpdateNotificationWithExclusions.builder()
                    .newPostsCount(count)
                    .timestamp(Instant.now())
                    .message(buildMessage(count))
                    .excludeUserIds(auth0IdsToExclude)
                    .build();

            // Send to all users with exclusion data
            messagingTemplate.convertAndSend("/topic/feed-updates", notification);

            log.info("Sent feed update notification: {} new post(s) to all users except {} creators",
                    count, auth0IdsToExclude.size());
        }
    }

    /**
     * Builds a user-friendly message based on the number of new posts.
     */
    private String buildMessage(int count) {
        if (count == 1) {
            return "There is 1 new post";
        } else {
            return String.format("There are %d new posts", count);
        }
    }

    /**
     * Manual trigger for testing purposes.
     */
    public void triggerFeedUpdate(int count) {
        FeedUpdateNotification notification = FeedUpdateNotification.builder()
                .newPostsCount(count)
                .timestamp(Instant.now())
                .message(buildMessage(count))
                .build();

        messagingTemplate.convertAndSend("/topic/feed-updates", notification);
        log.info("Manually triggered feed update notification: {} new post(s)", count);
    }

    /**
     * Extended notification that includes Auth0 user IDs to exclude.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedUpdateNotificationWithExclusions {
        private Integer newPostsCount;
        private Instant timestamp;
        private String message;
        private Set<String> excludeUserIds;
    }
}
