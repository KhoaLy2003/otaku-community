package com.otaku.community.feature.post.entity;

/**
 * Enumeration representing the status of a post.
 * DRAFT - Post is saved but not published to public feeds
 * PUBLISHED - Post is visible in public feeds and can be interacted with
 */
public enum PostStatus {
    DRAFT,
    PUBLISHED
}