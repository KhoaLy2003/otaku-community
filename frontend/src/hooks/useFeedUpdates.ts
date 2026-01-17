import { useEffect, useState, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth0 } from "@auth0/auth0-react";
import { env } from "@/lib/env";

interface FeedUpdateNotification {
  newPostsCount: number;
  timestamp: string;
  message: string;
}

interface FeedUpdateNotificationWithExclusions extends FeedUpdateNotification {
  excludeUserIds?: string[];
}

interface UseFeedUpdatesOptions {
  enabled?: boolean;
  onUpdate?: (notification: FeedUpdateNotification) => void;
}

interface UseFeedUpdatesReturn {
  notification: FeedUpdateNotification | null;
  isConnected: boolean;
  dismissNotification: () => void;
  handleRefresh: (refreshCallback: () => void) => void;
}

/**
 * Hook for listening to real-time feed updates via WebSocket.
 * Only active when user is on the feed page.
 * Excludes notifications for posts created by the current user.
 *
 * @param options Configuration options
 * @returns Object with notification state and refresh handler
 *
 * @example
 * ```tsx
 * const { notification, isConnected, dismissNotification, handleRefresh } = useFeedUpdates({
 *   enabled: true,
 *   onUpdate: (update) => console.log('New posts:', update.newPostsCount)
 * });
 *
 * const refreshFeed = () => {
 *   // Your refresh logic
 * };
 *
 * return (
 *   <>
 *     {notification && (
 *       <FeedUpdateBanner
 *         message={notification.message}
 *         newPostsCount={notification.newPostsCount}
 *         onRefresh={() => handleRefresh(refreshFeed)}
 *         onDismiss={dismissNotification}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */
export const useFeedUpdates = (
  options: UseFeedUpdatesOptions = {},
): UseFeedUpdatesReturn => {
  const { enabled = true, onUpdate } = options;
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const [notification, setNotification] =
    useState<FeedUpdateNotification | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const isConnectingRef = useRef(false);

  // Use a ref for onUpdate to avoid triggering the effect when the callback changes
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    let isMounted = true;

    if (!enabled || !isAuthenticated) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Prevent multiple connection attempts
    if (isConnectingRef.current || clientRef.current?.active) {
      return;
    }

    const connect = async () => {
      isConnectingRef.current = true;
      try {
        const token = await getAccessTokenSilently();

        // If we unmounted while waiting for the token, don't proceed
        if (!isMounted) return;

        const wsUrl =
          env.API_URL.replace("/api", "")
            .replace("http://", "ws://")
            .replace("https://", "wss://") + "/ws-native";

        // Create STOMP client
        const client = new Client({
          brokerURL: wsUrl,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          if (!isMounted) {
            client.deactivate();
            return;
          }
          console.log("[WS][FEED] 🔌 Connected");
          setIsConnected(true);

          // Subscribe to feed updates topic
          client.subscribe("/topic/feed-updates", (message) => {
            try {
              const update: FeedUpdateNotificationWithExclusions = JSON.parse(
                message.body,
              );
              console.log("[WS][FEED] 📨 Received:", update);

              // Check if current user should be excluded from this notification
              if (
                user &&
                update.excludeUserIds &&
                update.excludeUserIds.includes(user.sub!)
              ) {
                console.log(
                  "[WS][FEED] 🚫 Excluding current user from notification",
                );
                return;
              }

              // Create clean notification object without exclusion data
              const cleanNotification: FeedUpdateNotification = {
                newPostsCount: update.newPostsCount,
                timestamp: update.timestamp,
                message: update.message,
              };

              setNotification(cleanNotification);

              if (onUpdateRef.current) {
                onUpdateRef.current(cleanNotification);
              }
            } catch (error) {
              console.error("[WS][FEED] ❌ Failed to parse message:", error);
            }
          });
        };

        client.onDisconnect = () => {
          console.log("[WS][FEED] 🔌 Disconnected");
          if (isMounted) setIsConnected(false);
        };

        client.onStompError = (frame) => {
          console.error("[WS][FEED] ❌ STOMP error:", frame);
          if (isMounted) setIsConnected(false);
        };

        client.onWebSocketError = (event) => {
          console.error("[WS][FEED] ❌ WebSocket Error:", event);
          if (isMounted) setIsConnected(false);
        };

        // Activate the client
        client.activate();
        clientRef.current = client;
      } catch (error) {
        console.error("[WS][FEED] ❌ Failed to connect:", error);
        if (isMounted) setIsConnected(false);
      } finally {
        isConnectingRef.current = false;
      }
    };

    connect();

    // Cleanup on unmount or when dependencies change
    return () => {
      isMounted = false;
      if (clientRef.current) {
        console.log("[WS][FEED] Cleaning up");
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      isConnectingRef.current = false; // Ensure this is reset on cleanup
    };
  }, [enabled, isAuthenticated, getAccessTokenSilently, user]);

  /**
   * Dismiss the current notification
   */
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  /**
   * Handle refresh action (dismiss notification and trigger refresh)
   */
  const handleRefresh = useCallback(
    (refreshCallback: () => void) => {
      dismissNotification();
      refreshCallback();
    },
    [dismissNotification],
  );

  return {
    notification,
    isConnected,
    dismissNotification,
    handleRefresh,
  };
};
