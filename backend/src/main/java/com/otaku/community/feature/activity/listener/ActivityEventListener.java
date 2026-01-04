package com.otaku.community.feature.activity.listener;

import com.otaku.community.feature.activity.event.ActivityEvent;
import com.otaku.community.feature.activity.service.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ActivityEventListener {

    private final ActivityService activityService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleActivityEvent(ActivityEvent event) {
        log.debug("Handling activity event: {}", event);
        try {
            activityService.saveActivityLog(event);
        } catch (Exception e) {
            log.error("Failed to log activity: {}", event, e);
        }
    }
}
