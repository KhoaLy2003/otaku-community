package com.otaku.community.feature.activity.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.activity.dto.ActivityLogResponse;
import com.otaku.community.feature.activity.dto.LoginHistoryResponse;
import com.otaku.community.feature.activity.entity.ActivityLog;
import com.otaku.community.feature.activity.entity.ActivityTargetType;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.entity.LoginHistory;
import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.activity.mapper.ActivityMapper;
import com.otaku.community.feature.activity.repository.ActivityLogRepository;
import com.otaku.community.feature.activity.repository.LoginHistoryRepository;
import com.otaku.community.feature.user.entity.User;
import com.otaku.community.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityService {

    private final LoginHistoryRepository loginHistoryRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityMapper activityMapper;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<LoginHistoryResponse> getLoginHistory(int page, int limit, UUID currentUserId) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<LoginHistory> historyPage = loginHistoryRepository.findByUserIdOrderByCreatedAtDesc(currentUserId,
                pageable);

        return PageResponse.of(
                historyPage.getContent().stream()
                        .map(activityMapper::toLoginHistoryResponse)
                        .toList(),
                page,
                limit,
                historyPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PageResponse<ActivityLogResponse> getActivityLog(int page, int limit, UUID currentUserId) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<ActivityLog> logPage = activityLogRepository.findByUserIdOrderByCreatedAtDesc(currentUserId,
                pageable);

        return PageResponse.of(
                logPage.getContent().stream()
                        .map(activityMapper::toActivityLogResponse)
                        .toList(),
                page,
                limit,
                logPage.getTotalElements());
    }

    @Transactional
    public void saveActivityLog(ActivityEvent event) {
        User user = userRepository.findById(event.userId()).orElse(null);
        if (user == null) {
            log.warn("Cannot log activity for non-existent user: {}", event.userId());
            return;
        }

        ActivityLog logEntries = ActivityLog.builder()
                .user(user)
                .actionType(event.action())
                .targetType(event.targetType())
                .targetId(event.targetId())
                .metadata(event.metadata())
                .build();
        activityLogRepository.save(logEntries);
    }

    @Transactional
    public void logLogin(User user, String ipAddress, String userAgent) {
        LoginHistory history = LoginHistory.builder()
                .user(user)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();
        loginHistoryRepository.save(history);
        saveActivityLog(new ActivityEvent(user.getId(), ActivityType.LOGIN, ActivityTargetType.IP_ADDRESS,
                ipAddress, "User logged in from IP: " + ipAddress));
    }
}
