package com.otaku.community.feature.notification.listener;

import com.otaku.community.feature.notification.entity.Notification;
import com.otaku.community.feature.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    // Define Event classes here or import them if they exist commonly.
    // For now, I will assume we will create these events or simple record classes.
    // To make it compile, I'll define inner records or use a dedicated event
    // package later.
    // But since I need to trigger these from other services, I should define them
    // generally.
    // However, for this task scope I'm implementing the notification part.
    // I will define the NotificationEvent placeholders here or separate file.
    // To be clean, I should create a common event package or similar.

    // Let's create a generic NotificationEvent or specific events.
    // Ideally: PostLikedEvent, CommentCreatedEvent, etc.

    // I'll create a generic DTO for internal event for now to simplify,
    // or better: I will create the specific event classes in a `common/event`
    // package if I can,
    // or just listen to payload if I don't want to touch other modules yet.

    // Let's define the interface for the listener first.

    @Async
    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        log.debug("Received notification event: {}", event);
        notificationService.createAndSendNotification(
                event.recipientId(),
                event.senderId(),
                event.type(),
                event.targetId(),
                event.targetType(),
                event.preview());
    }

    public record NotificationEvent(
            UUID recipientId,
            UUID senderId,
            Notification.NotificationType type,
            UUID targetId,
            Notification.TargetType targetType,
            String preview) {
    }
}
