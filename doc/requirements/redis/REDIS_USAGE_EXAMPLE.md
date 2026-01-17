# Redis Cache Usage Examples

## Quick Start

### 1. Add Redis Password
Edit `backend/src/main/resources/application-dev.yml`:
```yaml
redis:
  password: YOUR_REDIS_CLOUD_PASSWORD
```

### 2. Start the Application
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Check Redis Connection
Look for these logs on startup:
```
INFO  - === Redis Connection Health Check ===
INFO  - ✓ Redis connection is HEALTHY - Successfully connected to Redis server
```

Or test via API:
```bash
curl http://localhost:8080/api/health/redis
```

## Example: Adding Cache to Existing Services

### Example 1: Cache User Profile
```java
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    // Cache user profile for 1 hour (default TTL)
    @Cacheable(value = "userProfile", key = "#userId")
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toProfileDTO(user);
    }
    
    // Evict cache when user updates profile
    @CacheEvict(value = "userProfile", key = "#userId")
    public void updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // Update user...
        userRepository.save(user);
    }
}
```

### Example 2: Cache Post List
```java
@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    
    // Cache post list with pagination
    @Cacheable(value = "postList", key = "#page + '-' + #size")
    public Page<PostDTO> getPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAll(pageable)
            .map(postMapper::toDTO);
    }
    
    // Evict all post list cache when new post is created
    @CacheEvict(value = "postList", allEntries = true)
    public PostDTO createPost(CreatePostRequest request) {
        Post post = postMapper.toEntity(request);
        Post savedPost = postRepository.save(post);
        return postMapper.toDTO(savedPost);
    }
}
```

### Example 3: Cache Anime/Manga Details
```java
@Service
@RequiredArgsConstructor
public class AnimeService {
    
    private final AnimeRepository animeRepository;
    
    // Cache anime details - rarely changes
    @Cacheable(value = "animeDetails", key = "#animeId")
    public AnimeDTO getAnimeById(Long animeId) {
        Anime anime = animeRepository.findById(animeId)
            .orElseThrow(() -> new ResourceNotFoundException("Anime not found"));
        return animeMapper.toDTO(anime);
    }
    
    // Cache popular anime list
    @Cacheable(value = "popularAnime", key = "'top-' + #limit")
    public List<AnimeDTO> getPopularAnime(int limit) {
        return animeRepository.findTopByOrderByPopularityDesc(limit)
            .stream()
            .map(animeMapper::toDTO)
            .collect(Collectors.toList());
    }
}
```

### Example 4: Multiple Cache Eviction
```java
@Service
@RequiredArgsConstructor
public class InteractionService {
    
    // When user likes a post, evict multiple related caches
    @Caching(evict = {
        @CacheEvict(value = "postDetails", key = "#postId"),
        @CacheEvict(value = "postList", allEntries = true),
        @CacheEvict(value = "userActivity", key = "#userId")
    })
    public void likePost(Long userId, Long postId) {
        // Like logic...
    }
}
```

## Cache Names Convention

Recommended cache naming:
- `userProfile` - User profile data
- `userActivity` - User activity/stats
- `postList` - Post listings
- `postDetails` - Individual post details
- `animeDetails` - Anime information
- `mangaDetails` - Manga information
- `topicList` - Topic listings
- `popularAnime` - Popular anime rankings
- `notifications` - User notifications

## Testing Cache Behavior

### Test 1: Verify Caching Works
```java
@SpringBootTest
class CacheTest {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CacheManager cacheManager;
    
    @Test
    void testUserProfileCache() {
        Long userId = 1L;
        
        // First call - should hit database
        UserProfileDTO profile1 = userService.getUserProfile(userId);
        
        // Second call - should hit cache
        UserProfileDTO profile2 = userService.getUserProfile(userId);
        
        // Verify cache contains the entry
        Cache cache = cacheManager.getCache("userProfile");
        assertNotNull(cache.get(userId));
    }
}
```

### Test 2: Verify App Works Without Redis
1. Stop Redis or set `redis.enabled=false`
2. Start application
3. Application should start successfully with warnings:
```
WARN - Redis connection is DOWN - Application will continue to operate without Redis cache
```

## Performance Tips

1. **Cache Frequently Read Data**: User profiles, anime/manga details, popular lists
2. **Don't Cache Rapidly Changing Data**: Real-time notifications, live chat messages
3. **Use Appropriate TTL**: 
   - Static data (anime info): Long TTL (24 hours)
   - User data: Medium TTL (1 hour)
   - Dynamic data: Short TTL (5 minutes)
4. **Evict Strategically**: Clear cache only when data actually changes

## Monitoring

Check Redis cache statistics in logs:
```
DEBUG - Redis basic operations test: PASSED
```

Monitor cache hit/miss rates (add to your monitoring):
```java
@Scheduled(fixedRate = 60000)
public void logCacheStats() {
    // Log cache statistics
}
```

## Common Issues

### Issue: Cache not working
**Solution**: Check logs for Redis connection errors. App will work without cache.

### Issue: Stale data in cache
**Solution**: Ensure `@CacheEvict` is called when data updates.

### Issue: Memory issues
**Solution**: Adjust TTL or implement cache size limits in RedisConfig.

## Next Steps

1. Add `@Cacheable` to your most frequently called read operations
2. Add `@CacheEvict` to update/delete operations
3. Monitor application logs for cache performance
4. Adjust TTL based on your data update frequency
