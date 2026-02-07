package com.otaku.community.common.util;

import com.otaku.community.common.dto.CursorInfo;
import com.otaku.community.common.entity.BaseEntity;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

import static com.otaku.community.common.constant.CommonConstant.DEFAULT_PAGE_SIZE;
import static com.otaku.community.common.constant.CommonConstant.MAX_PAGE_SIZE;

@Slf4j
public class PaginationUtils {

    private PaginationUtils() {
        // Utility class
    }

    /**
     * Generate cursor from entity
     */
    public static String generateCursor(BaseEntity entity) {
        return generateCursor(entity.getCreatedAt(), entity.getId());
    }

    /**
     * Generate cursor from raw components (useful for DTOs)
     */
    public static String generateCursor(Instant timestamp, UUID id) {
        if (timestamp == null || id == null) {
            return null;
        }
        String cursorData = timestamp.toEpochMilli() + ":" + id;
        return Base64.getEncoder().encodeToString(cursorData.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Parse cursor string into cursor info
     */
    public static CursorInfo parseCursor(String cursor) {
        if (cursor == null || cursor.isBlank()) {
            return new CursorInfo(null, null);
        }

        try {
            String decoded = new String(Base64.getDecoder().decode(cursor), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":", 2);

            long epochMillis = Long.parseLong(parts[0]);
            Instant createdAt = Instant.ofEpochMilli(epochMillis);
            UUID id = UUID.fromString(parts[1]);

            return new CursorInfo(createdAt, id);
        } catch (Exception e) {
            log.warn("Invalid cursor format: {}", cursor, e);
            return new CursorInfo(null, null);
        }
    }

    /**
     * Validate and normalize page size
     */
    public static int validateAndGetPageSize(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(limit, MAX_PAGE_SIZE);
    }
}
