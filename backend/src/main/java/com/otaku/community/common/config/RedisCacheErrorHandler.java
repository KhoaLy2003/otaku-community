package com.otaku.community.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheErrorHandler;

/**
 * Custom error handler for Redis cache operations.
 * Ensures the application continues to work normally even when Redis is unavailable.
 */
@Slf4j
public class RedisCacheErrorHandler implements CacheErrorHandler {

    @Override
    public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
        log.warn("Failed to get cache entry from Redis. Cache: {}, Key: {}. Application will continue without cache. Error: {}",
                cache.getName(), key, exception.getMessage());
    }

    @Override
    public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
        log.warn("Failed to put cache entry to Redis. Cache: {}, Key: {}. Application will continue without cache. Error: {}",
                cache.getName(), key, exception.getMessage());
    }

    @Override
    public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
        log.warn("Failed to evict cache entry from Redis. Cache: {}, Key: {}. Application will continue without cache. Error: {}",
                cache.getName(), key, exception.getMessage());
    }

    @Override
    public void handleCacheClearError(RuntimeException exception, Cache cache) {
        log.warn("Failed to clear cache in Redis. Cache: {}. Application will continue without cache. Error: {}",
                cache.getName(), exception.getMessage());
    }
}
