# Redis Documentation

This document provides a comprehensive overview of the Redis integration in the Otaku Community Backend project.

## Overview

Redis is used in this project as a distributed cache to improve performance and reduce the load on the database. The integration is designed to be resilient, allowing the application to function even if the Redis server is unavailable.

The project uses Spring's caching abstraction, which allows for easy integration with Redis through annotations.

## Configuration

The main Redis configuration is located in `src/main/java/com/otaku/community/common/config/RedisConfig.java`.

### Key Configuration Beans

*   **`lettuceConnectionFactory()`**: Configures the connection to the Redis server using Lettuce as the client. Connection details (host, port, username, password) are read from the application's configuration properties.

*   **`redisTemplate()`**: Provides a `RedisTemplate` bean for direct interaction with Redis. It's configured with:
    *   `StringRedisSerializer` for keys.
    *   `GenericJackson2JsonRedisSerializer` for values, which allows for storing and retrieving Java objects as JSON.

*   **`cacheManager()`**: Configures the `CacheManager` for Spring's caching abstraction. It's set up with:
    *   A default Time-To-Live (TTL) for cache entries, configurable via the `redis.cache.ttl` property.
    *   `StringRedisSerializer` for cache keys.
    *   `GenericJackson2JsonRedisSerializer` for cache values.
    *   Disabling the caching of null values.

*   **`keyGenerator()`**: Defines a custom `KeyGenerator` for generating cache keys. The default strategy creates a key by combining the class name, method name, and method parameters.

*   **`errorHandler()`**: Specifies a custom `CacheErrorHandler` (`RedisCacheErrorHandler`) to handle exceptions during cache operations.

### Enabling/Disabling Redis

Redis caching can be enabled or disabled via the `redis.enabled` property in the application's configuration file. If the property is not present, Redis is enabled by default.

```yaml
redis:
  enabled: true # set to false to disable
```

## Cache Usage

The project uses Spring's caching annotations to manage the cache. Below are some examples of how to use these annotations.

### `@Cacheable`

The `@Cacheable` annotation is used to cache the result of a method. If the cache contains an entry for the given key, the method is not executed, and the result is returned from the cache.

**Example:** Caching a user's profile.

```java
@Cacheable(value = "userProfile", key = "#userId")
public UserProfileDTO getUserProfile(Long userId) {
    // ... method implementation
}
```

*   `value`: The name of the cache.
*   `key`: The key for the cache entry. Here, we use the `userId` as the key.

### `@CacheEvict`

The `@CacheEvict` annotation is used to remove one or more entries from the cache.

**Example:** Evicting the user profile cache when the profile is updated.

```java
@CacheEvict(value = "userProfile", key = "#userId")
public void updateUserProfile(Long userId, UpdateProfileRequest request) {
    // ... method implementation
}
```

To evict all entries from a cache, use the `allEntries = true` attribute:

```java
@CacheEvict(value = "postList", allEntries = true)
public PostDTO createPost(CreatePostRequest request) {
    // ... method implementation
}
```

### `@Caching`

The `@Caching` annotation allows for grouping multiple caching annotations on a single method.

**Example:** Evicting multiple caches when a user likes a post.

```java
@Caching(evict = {
    @CacheEvict(value = "postDetails", key = "#postId"),
    @CacheEvict(value = "postList", allEntries = true),
    @CacheEvict(value = "userActivity", key = "#userId")
})
public void likePost(Long userId, Long postId) {
    // ... method implementation
}
```

## Error Handling

The custom `RedisCacheErrorHandler` (in `src/main/java/com/otaku/community/common/config/RedisCacheErrorHandler.java`) ensures that the application can withstand Redis failures.

If Redis is unavailable, the error handler logs a warning message and allows the application to continue its operation without caching. This prevents the application from crashing due to Redis-related issues.

**Example log message:**

```
WARN - Failed to get cache entry from Redis. Cache: userProfile, Key: 1. Application will continue without cache.
```

## Monitoring

### Health Check

The project includes a Redis health check endpoint that can be used to monitor the connection to the Redis server.

To check the Redis connection status, you can send a GET request to `/api/health/redis`.

### Cache Statistics

You can monitor cache hit/miss rates by implementing a mechanism to log cache statistics periodically. For example, you can use a scheduled task to log the statistics from the `CacheManager`.

## Best Practices

*   **Cache frequently read data**: Identify data that is read often but changes infrequently, such as user profiles, anime/manga details, and popular lists.
*   **Don't cache rapidly changing data**: Avoid caching data that changes very frequently, such as real-time notifications or live chat messages.
*   **Use appropriate TTLs**: Configure the Time-To-Live (TTL) for your caches based on the data's volatility. Static data can have a long TTL, while more dynamic data should have a shorter TTL.
*   **Evict caches strategically**: Ensure that you have a clear strategy for evicting caches when the underlying data changes. Use `@CacheEvict` in methods that modify the data.
*   **Use descriptive cache names**: Use clear and descriptive names for your caches to make them easier to manage and monitor.
