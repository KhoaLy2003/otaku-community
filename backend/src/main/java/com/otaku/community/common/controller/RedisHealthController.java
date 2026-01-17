package com.otaku.community.common.controller;

import com.otaku.community.common.service.RedisHealthCheckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Health Check", description = "System health check endpoints")
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true", matchIfMissing = true)
public class RedisHealthController {

    private final RedisHealthCheckService redisHealthCheckService;

    @GetMapping("/redis")
    @Operation(summary = "Check Redis connection status")
    public ResponseEntity<Map<String, Object>> checkRedisHealth() {
        Map<String, Object> response = new HashMap<>();

        boolean isAvailable = redisHealthCheckService.isRedisAvailable();

        response.put("service", "Redis");
        response.put("status", isAvailable ? "UP" : "DOWN");
        response.put("message", isAvailable
                ? "Redis connection is healthy"
                : "Redis connection is unavailable - Application running without cache");

        return ResponseEntity.ok(response);
    }
}
