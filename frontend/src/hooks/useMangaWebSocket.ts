import { useEffect, useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuth0 } from "@auth0/auth0-react";
import { env } from "@/lib/env";
import type { UploadJob } from "@/types/manga";

interface UseMangaWebSocketOptions {
  onUploadUpdate?: (job: UploadJob) => void;
}

export const useMangaWebSocket = (options: UseMangaWebSocketOptions = {}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const onUploadUpdateRef = useRef(options.onUploadUpdate);

  useEffect(() => {
    onUploadUpdateRef.current = options.onUploadUpdate;
  }, [options.onUploadUpdate]);

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);

  const getClient = useCallback(async (): Promise<Client | null> => {
    if (clientRef.current?.connected) {
      return clientRef.current;
    }

    if (!isAuthenticated) {
      return null;
    }

    try {
      const token = await getAccessTokenSilently();
      const wsUrl =
        env.API_URL.replace("/api", "").replace("http://", "ws://") +
        "/ws-native";

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
        console.log("[WS][MANGA] ✅ Connected");

        subscriptionRef.current = client.subscribe(
          "/user/queue/upload-progress",
          (message: IMessage) => {
            try {
              const job = JSON.parse(message.body) as UploadJob;
              if (onUploadUpdateRef.current) {
                onUploadUpdateRef.current(job);
              }
            } catch (error) {
              console.error(
                "[WS][MANGA] ❌ Failed to parse upload update:",
                error,
              );
            }
          },
        );
      };

      client.onStompError = (frame) => {
        console.error(
          "[WS][MANGA] STOMP error:",
          frame.headers["message"],
          frame.body,
        );
      };

      client.onWebSocketError = (event) => {
        console.error("[WS][MANGA] ❌ WebSocket Error", event);
      };

      client.onDisconnect = () => {
        console.log("[WS][MANGA] 🔌 Disconnected");
        subscriptionRef.current = null;
      };

      client.activate();
      clientRef.current = client;
      return client;
    } catch (error) {
      console.error("[WS][MANGA] ❌ Failed to connect:", error);
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      getClient();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [isAuthenticated, getClient]);

  return {
    isConnected: clientRef.current?.connected ?? false,
  };
};
