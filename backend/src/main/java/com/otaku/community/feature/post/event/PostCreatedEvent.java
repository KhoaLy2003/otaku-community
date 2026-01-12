package com.otaku.community.feature.post.event;

import com.otaku.community.feature.post.entity.Post;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Event published when a new post is created.
 */
@Getter
@RequiredArgsConstructor
public class PostCreatedEvent {
    private final Post post;
}
