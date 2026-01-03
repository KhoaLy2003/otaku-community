package com.otaku.community.feature.activity.service;

import com.otaku.community.common.dto.PageResponse;
import com.otaku.community.feature.activity.dto.ActivityLogResponse;
import com.otaku.community.feature.activity.dto.LoginHistoryResponse;
import com.otaku.community.feature.activity.entity.ActivityLog;
import com.otaku.community.feature.activity.entity.ActivityType;
import com.otaku.community.feature.activity.entity.LoginHistory;
import com.otaku.community.feature.activity.mapper.ActivityMapper;
import com.otaku.community.feature.activity.repository.ActivityLogRepository;
import com.otaku.community.feature.activity.repository.LoginHistoryRepository;
import com.otaku.community.feature.user.entity.User;
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
        Page<ActivityLog> logPage = activityLogRepository.findByUserIdOrderByCreatedAtDesc(currentUserId, pageable);

        return PageResponse.of(
                logPage.getContent().stream()
                        .map(activityMapper::toActivityLogResponse)
                        .toList(),
                page,
                limit,
                logPage.getTotalElements());
    }

    @Transactional
    public void logActivity(User user, ActivityType actionType, String metadata) {
        ActivityLog logEntries = ActivityLog.builder()
                .user(user)
                .actionType(actionType)
                .metadata(metadata)
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
        logActivity(user, ActivityType.LOGIN, "User logged in from IP: " + ipAddress);
    }
}
