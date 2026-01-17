# Real-Time Feed Updates

## Overview

This feature provides real-time notifications to users when new posts are created, allowing them to refresh their feed to see the latest content. The implementation uses WebSocket with signal aggregation to prevent overwhelming clients with too many notifications.

## Key Features

- **Non-intrusive notifications**: Shows a banner at the top of the feed page
- **User control**: Users can choose to refresh or dismiss the notification
- **Signal aggregation**: Batches multiple post creations into a single notification every 10 seconds
- **Page-specific**: Only active when user is on the feed page
- **Graceful degradation**: App works normally even if WebSocket connection fails

## Architecture

### Backend Components

#### 1. FeedUpdateService
**Location**: `backend/src/main/java/com/otaku/community/feature/feed/service/FeedUpdateService.java`

- Manages real-time feed update notifications
- Aggregates post creation events
- Sends batched notifications every 10 seconds via WebSocket
- Uses `AtomicInteger` for thread-safe counting

**Key Methods**:
- `notifyNewPost()`: Called when a new post is created
- `sendAggregatedFeedUpdate()`: Scheduled task that runs every 10 seconds
- `triggerFeedUpdate(int count)`: Manual trigger for testing

#### 2. FeedUpdateNotification DTO
**Location**: `backend/src/main/java/com/otaku/community/feature/feed/dto/FeedUpdateNotification.java`

```java
{
  "newPostsCount": 5,
  "timestamp": "2026-01-16T10:30:00Z",
  "message": "There are 5 new posts"
}
```

#### 3. PostServiceImpl Integration
**Location**: `backend/src/main/java/com/otaku/community/feature/post/service/impl/PostServiceImpl.java`

- Calls `feedUpdateService.notifyNewPost()` after creating a post
- Integrated into the existing post creation flow

### Frontend Components

#### 1. useFeedUpdates Hook
**Location**: `frontend/src/hooks/useFeedUpdates.ts`

Custom React hook that:
- Establishes WebSocket connection
- Subscribes to `/topic/feed-updates`
- Manages notification state
- Provides handlers for refresh and dismiss actions

**Usage**:
```typescript
const { notification, isConnected, dismissNotification, handleRefresh } = useFeedUpdates({
  enabled: true, // Only enable on feed page
  onUpdate: (update) => console.log('New posts:', update.newPostsCount)
});
```

#### 2. FeedUpdateBanner Component
**Location**: `frontend/src/components/feed/FeedUpdateBanner.tsx`

- Displays notification banner at top of page
- Shows message and post count
- Provides "Refresh Feed" and dismiss buttons
- Animated slide-down entrance

#### 3. Integration Example
**Location**: `frontend/src/components/feed/FeedPageExample.tsx`

Complete example showing how to integrate the feature into a feed page.

## Signal Aggregation

### How It Works

1. **Post Creation**: When a user creates a post, `feedUpdateService.notifyNewPost()` is called
2. **Counting**: The service increments an atomic counter
3. **Aggregation Window**: Every 10 seconds, a scheduled task checks the counter
4. **Notification**: If counter > 0, sends a single notification with the total count
5. **Reset**: Counter is reset to 0 after sending

### Example Timeline

```
00:00 - User A creates post → Counter: 1
00:03 - User B creates post → Counter: 2
00:07 - User C creates post → Counter: 3
00:10 - Scheduled task runs → Sends "There are 3 new posts" → Counter: 0
00:12 - User D creates post → Counter: 1
00:15 - User E creates post → Counter: 2
00:20 - Scheduled task runs → Sends "There are 2 new posts" → Counter: 0
```

## WebSocket Configuration

### Endpoint
- **SockJS**: `/ws-registry`
- **Native WebSocket**: `/ws-native`

### Topic
- **Feed Updates**: `/topic/feed-updates`

### Connection Settings
- Reconnect delay: 5 seconds
- Heartbeat: 4 seconds (incoming/outgoing)

## Implementation Guide

### Backend Setup

1. **Enable Scheduling** (already done in `OtakuCommunityApplication.java`):
```java
@EnableScheduling
```

2. **Service is auto-configured** via Spring dependency injection

### Frontend Integration

1. **Install dependencies** (already installed):
```bash
npm install @stomp/stompjs sockjs-client
npm install --save-dev @types/sockjs-client
```

2. **Import in your Feed page** (HomePage.tsx):
```typescript
import { useFeedUpdates } from '@/hooks/useFeedUpdates';
import { FeedUpdateBanner } from '@/components/feed/FeedUpdateBanner';

function HomePage() {
  const { notification, isConnected, dismissNotification, handleRefresh } = useFeedUpdates({
    enabled: true,
    onUpdate: (update) => {
      console.log('Feed update received:', update.newPostsCount, 'new posts');
    },
  });

  const refreshFeed = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new Event('REFRESH_FEED'));
  };

  return (
    <>
      {notification && (
        <FeedUpdateBanner
          message={notification.message}
          newPostsCount={notification.newPostsCount}
          onRefresh={() => handleRefresh(refreshFeed)}
          onDismiss={dismissNotification}
        />
      )}
      
      {/* Optional: Connection indicator for dev mode */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg text-sm z-40">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span>{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      )}
      
      {/* Your feed content */}
    </>
  );
}
```

3. **Alternative: Toast-style notification**:
```typescript
import { FeedUpdateToast } from '@/components/feed/FeedUpdateToast';

// Use FeedUpdateToast instead of FeedUpdateBanner for bottom-right notification
{notification && (
  <FeedUpdateToast
    message={notification.message}
    newPostsCount={notification.newPostsCount}
    onRefresh={() => handleRefresh(refreshFeed)}
    onDismiss={dismissNotification}
    autoHideDelay={10000} // Optional: auto-hide after 10 seconds
  />
)}
```

## Configuration

### Aggregation Window
To change the 10-second window, modify `@Scheduled` in `FeedUpdateService.java`:

```java
@Scheduled(fixedRate = 10000) // milliseconds
```

### WebSocket Settings
Configure in `WebSocketConfig.java`:
- Broker prefixes
- Endpoints
- CORS settings

## Testing

### Manual Testing

1. **Start backend**: `mvn spring-boot:run`
2. **Start frontend**: `npm run dev`
3. **Open feed page** in browser
4. **Create posts** from another browser/tab
5. **Observe notification** appears after 10 seconds

### Testing Multiple Posts

1. Create 3-5 posts within 10 seconds
2. Wait for aggregation window
3. Should see single notification: "There are X new posts"

### Testing Dismiss

1. Wait for notification to appear
2. Click X button
3. Notification should disappear
4. Feed should NOT refresh

### Testing Refresh

1. Wait for notification to appear
2. Click "Refresh Feed" button
3. Notification should disappear
4. Feed should refresh with new posts

## Monitoring

### Backend Logs

```
INFO  - Sent feed update notification: 3 new post(s)
DEBUG - New post created. Current aggregated count: 1
```

### Frontend Console (Dev Mode)

```
[WebSocket] Connected to WebSocket
[Feed Updates] Connected to WebSocket
[Feed Updates] Received: {newPostsCount: 3, message: "There are 3 new posts", ...}
```

## Performance Considerations

### Backend
- **Atomic operations**: Thread-safe counter using `AtomicInteger`
- **Minimal overhead**: Only increments counter on post creation
- **Scheduled task**: Runs every 10 seconds regardless of activity
- **No database queries**: Pure in-memory operation

### Frontend
- **Single WebSocket connection**: Reused across component lifecycle
- **Automatic reconnection**: Handles connection drops
- **Conditional rendering**: Banner only shown when notification exists
- **Memory efficient**: Cleans up on unmount

## Limitations

1. **In-memory counter**: Resets on server restart
2. **No persistence**: Notifications not stored
3. **No user-specific filtering**: All users see same count
4. **Fixed window**: 10-second aggregation not configurable at runtime

## Future Enhancements

1. **User-specific notifications**: Only notify about posts from followed users
2. **Configurable window**: Allow users to set aggregation interval
3. **Notification history**: Store recent notifications
4. **Redis-based counter**: Persist across server restarts
5. **Topic-based filtering**: Notify based on user's topic preferences
6. **Sound/visual effects**: Optional audio notification
7. **Badge count**: Show count in browser tab title

## Troubleshooting

### Notification not appearing

1. Check WebSocket connection status (dev mode shows indicator)
2. Verify backend logs show "Sent feed update notification"
3. Check browser console for WebSocket errors
4. Ensure `enabled` prop is `true` in `useFeedUpdates`

### Multiple notifications

1. Verify only one instance of `useFeedUpdates` is active
2. Check for duplicate WebSocket subscriptions
3. Ensure proper cleanup on component unmount

### Connection drops

1. Check network stability
2. Verify WebSocket endpoint is accessible
3. Review CORS configuration
4. Check firewall/proxy settings

## Related Files

### Backend
- `FeedUpdateService.java` - Main service
- `FeedUpdateNotification.java` - DTO
- `PostServiceImpl.java` - Integration point
- `WebSocketConfig.java` - WebSocket configuration

### Frontend
- `useFeedUpdates.ts` - React hook
- `FeedUpdateBanner.tsx` - UI component
- `FeedPageExample.tsx` - Integration example
- `tailwind.config.js` - Animation styles

## API Reference

### WebSocket Message Format

**Topic**: `/topic/feed-updates`

**Message Body**:
```json
{
  "newPostsCount": 5,
  "timestamp": "2026-01-16T10:30:00.000Z",
  "message": "There are 5 new posts"
}
```

### Hook API

```typescript
useFeedUpdates(options?: {
  enabled?: boolean;
  onUpdate?: (notification: FeedUpdateNotification) => void;
}): {
  notification: FeedUpdateNotification | null;
  isConnected: boolean;
  dismissNotification: () => void;
  handleRefresh: (refreshCallback: () => void) => void;
}
```
