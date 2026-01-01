package com.otaku.community.feature.notification.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.common.exception.ResourceNotFoundException;
import com.otaku.community.feature.notification.dto.NotificationResponse;
import com.otaku.community.feature.notification.dto.UnreadCountResponse;
import com.otaku.community.feature.notification.entity.Notification;
import com.otaku.community.feature.notification.repository.NotificationRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void createAndSendNotification(UUID recipientId, UUID senderId, Notification.NotificationType type,
                                          UUID targetId, Notification.TargetType targetType, String preview) {

        // Do not notify if sender is the same as recipient
        if (recipientId.equals(senderId)) {
            return;
        }

        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .senderId(senderId)
                .notificationType(type)
                .targetId(targetId)
                .targetType(targetType)
                .preview(preview)
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);

        // Fetch sender details for response
        User sender = userRepository.findById(senderId).orElse(null);
        NotificationResponse response = mapToResponse(savedNotification, sender);

        // Send real-time notification
        messagingTemplate.convertAndSendToUser(
                recipientId.toString(),
                "/queue/notifications",
                response);
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotifications(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notificationPage = notificationRepository.findAllByRecipientId(userId, pageable);

        List<NotificationResponse> content = notificationPage.getContent().stream()
                .map(notification -> {
                    User sender = null;
                    if (notification.getSenderId() != null) {
                        sender = userRepository.findById(notification.getSenderId()).orElse(null);
                    }
                    return mapToResponse(notification, sender);
                })
                .toList();

        return PageResponse.of(
                content,
                notificationPage.getNumber() + 1,
                notificationPage.getSize(),
                notificationPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(UUID userId) {
        long count = notificationRepository.countByRecipientIdAndIsReadFalse(userId);
        return new UnreadCountResponse(count);
    }

    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getRecipientId().equals(userId)) {
            // Silently ignore or throw warning, but sticking to logic
            return;
        }

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsRead(userId);
    }

    private NotificationResponse mapToResponse(Notification notification, User sender) {
        NotificationResponse.SenderDTO senderDTO = null;
        if (sender != null) {
            senderDTO = NotificationResponse.SenderDTO.builder()
                    .id(sender.getId())
                    .username(sender.getUsername())
                    .avatarUrl(sender.getAvatarUrl())
                    .build();
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .notificationType(notification.getNotificationType())
                .sender(senderDTO)
                .targetId(notification.getTargetId())
                .targetType(notification.getTargetType())
                .preview(notification.getPreview())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
