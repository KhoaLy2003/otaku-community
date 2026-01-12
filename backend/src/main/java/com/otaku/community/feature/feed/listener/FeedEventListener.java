package com.otaku.community.feature.feed.listener;

import com.otaku.community.feature.feed.service.FeedService;
import com.otaku.community.feature.post.event.PostCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class FeedEventListener {

    private final FeedService feedService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePostCreated(PostCreatedEvent event) {
        log.debug("Handling PostCreatedEvent for post: {}", event.getPost().getId());
        feedService.fanOutToFollowers(event.getPost());
    }
}
