package com.otaku.community.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Service to monitor Redis connection health.
 * Logs connection status without crashing the application if Redis is unavailable.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true", matchIfMissing = true)
public class RedisHealthCheckService {

    private final RedisConnectionFactory redisConnectionFactory;
    private final RedisTemplate<String, Object> redisTemplate;

    private Boolean lastConnectionStatus = null; // null = not checked yet

    /**
     * Check Redis connection on application startup
     */
    @EventListener(ApplicationReadyEvent.class)
    public void checkConnectionOnStartup() {
        log.info("=== Redis Connection Health Check ===");
        checkRedisConnection();
    }

    /**
     * Periodically check Redis connection (every 5 minutes)
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void scheduledHealthCheck() {
        checkRedisConnection();
    }

    /**
     * Perform Redis connection health check
     */
    private void checkRedisConnection() {
        try {
            log.debug("Attempting to connect to Redis...");

            // Try to ping Redis
            String pingResult = redisConnectionFactory.getConnection().ping();

            log.debug("Redis ping result: {}", pingResult);

            if ("PONG".equals(pingResult)) {
                if (lastConnectionStatus == null || !lastConnectionStatus) {
                    log.info("✓ Redis connection is HEALTHY - Successfully connected to Redis server");
                    lastConnectionStatus = true;
                }

                // Test basic operations
                testBasicOperations();
            } else {
                handleConnectionFailure("Unexpected ping response: " + pingResult);
            }

        } catch (Exception e) {
            log.error("Redis connection failed with exception: ", e);
            handleConnectionFailure(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    /**
     * Test basic Redis operations
     */
    private void testBasicOperations() {
        try {
            String testKey = "health:check:test";
            String testValue = "OK";

            // Test SET operation
            redisTemplate.opsForValue().set(testKey, testValue);

            // Test GET operation
            Object retrievedValue = redisTemplate.opsForValue().get(testKey);

            if (testValue.equals(retrievedValue)) {
                log.debug("Redis basic operations test: PASSED");
            } else {
                log.warn("Redis basic operations test: FAILED - Value mismatch");
            }

            // Clean up test key
            redisTemplate.delete(testKey);

        } catch (Exception e) {
            log.warn("Redis basic operations test failed: {}", e.getMessage());
        }
    }

    /**
     * Handle connection failure
     */
    private void handleConnectionFailure(String errorMessage) {
        log.error("✗ Redis connection is DOWN - {}", errorMessage);
        log.warn("Application will continue to operate without Redis cache");
        lastConnectionStatus = false;
    }

    /**
     * Manual health check method that can be called from controllers
     */
    public boolean isRedisAvailable() {
        try {
            String pingResult = redisConnectionFactory.getConnection().ping();
            return "PONG".equals(pingResult);
        } catch (Exception e) {
            return false;
        }
    }
}
