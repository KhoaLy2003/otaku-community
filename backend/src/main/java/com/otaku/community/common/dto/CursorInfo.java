package com.otaku.community.common.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Cursor information record
 */
public record CursorInfo(Instant createdAt, UUID id) {
}
