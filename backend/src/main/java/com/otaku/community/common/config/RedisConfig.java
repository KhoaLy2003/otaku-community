package com.otaku.community.common.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.interceptor.CacheResolver;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@EnableCaching
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true", matchIfMissing = true)
public class RedisConfig implements CachingConfigurer {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Value("${spring.data.redis.username}")
    private String redisUsername;

    @Value("${spring.data.redis.password}")
    private String redisPassword;

    @Value("${redis.cache.ttl:3600}")
    private long cacheTtl;

    @Bean
    @Primary
    public ObjectMapper httpObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    @Bean
    public ObjectMapper redisObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        // Enable default typing to preserve type information
        objectMapper.activateDefaultTyping(
                objectMapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );
        return objectMapper;
    }

    @Bean
    public LettuceConnectionFactory lettuceConnectionFactory() {
        log.info("Connecting redis: {}:{}", redisHost, redisPort);
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(redisHost, redisPort);
        redisStandaloneConfiguration.setUsername(redisUsername);
        redisStandaloneConfiguration.setPassword(redisPassword);
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(lettuceConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());

        // Configure Jackson serializer with JSR310 module for Java 8 date/time types
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(redisObjectMapper());
        redisTemplate.setValueSerializer(jsonSerializer);
        redisTemplate.setHashValueSerializer(jsonSerializer);

        log.info("Redis connected !");
        return redisTemplate;
    }

    @Bean
    @Override
    public CacheManager cacheManager() {
        // Configure Jackson serializer with JSR310 module for Java 8 date/time types
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(redisObjectMapper());

        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(cacheTtl))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(jsonSerializer))
                .disableCachingNullValues();

        // Custom TTL configurations for different cache types
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // Anime/Manga detail - 12 hours (rarely changes)
        cacheConfigurations.put("animeDetail", defaultConfig.entryTtl(Duration.ofHours(12)));
        cacheConfigurations.put("mangaDetail", defaultConfig.entryTtl(Duration.ofHours(12)));

        // Anime/Manga lists - 6 hours
        cacheConfigurations.put("animeTrending", defaultConfig.entryTtl(Duration.ofHours(6)));
        cacheConfigurations.put("animeSeasonal", defaultConfig.entryTtl(Duration.ofHours(6)));
        cacheConfigurations.put("mangaTop", defaultConfig.entryTtl(Duration.ofHours(6)));
        cacheConfigurations.put("animeSeasonArchive", defaultConfig.entryTtl(Duration.ofHours(24)));

        // Search results - 30 minutes (more dynamic)
        cacheConfigurations.put("animeSearch", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigurations.put("mangaSearch", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigurations.put("characterSearch", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        // Characters - 6 hours
        cacheConfigurations.put("animeCharacters", defaultConfig.entryTtl(Duration.ofHours(6)));

        // User profile - 30 minutes
        cacheConfigurations.put("userProfile", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        RedisCacheManager cacheManager = RedisCacheManager.builder(lettuceConnectionFactory())
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();

        log.info("Redis CacheManager configured with default TTL: {} seconds", cacheTtl);
        log.info("Custom cache TTLs: animeDetail/mangaDetail=12h, lists=6h, search=30m");

        return cacheManager;
    }

    @Bean
    @Override
    public CacheErrorHandler errorHandler() {
        return new RedisCacheErrorHandler();
    }

    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            StringBuilder sb = new StringBuilder();
            sb.append(target.getClass().getSimpleName());
            sb.append(":");
            sb.append(method.getName());
            for (Object param : params) {
                sb.append(":");
                sb.append(param != null ? param.toString() : "null");
            }
            return sb.toString();
        };
    }

    @Override
    public CacheResolver cacheResolver() {
        return null; // Use default
    }
}
