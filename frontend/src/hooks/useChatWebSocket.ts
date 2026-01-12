import { useEffect, useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuth0 } from "@auth0/auth0-react";
import type {
  Message,
  ChatWebSocketEvent,
  SendMessageRequest,
  MarkReadRequest,
} from "@/types/chat";
import { env } from "@/lib/env";

interface UseChatWebSocketOptions {
  onMessage?: (message: Message) => void;
  onReadReceipt?: (event: ChatWebSocketEvent) => void;
  onMessageDeleted?: (event: ChatWebSocketEvent) => void;
}

export const useChatWebSocket = (options: UseChatWebSocketOptions = {}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Use refs for callbacks to avoid stale closures in WebSocket handlers
  const onMessageRef = useRef(options.onMessage);
  const onReadReceiptRef = useRef(options.onReadReceipt);
  const onMessageDeletedRef = useRef(options.onMessageDeleted);

  // Update refs when options change
  useEffect(() => {
    onMessageRef.current = options.onMessage;
    onReadReceiptRef.current = options.onReadReceipt;
    onMessageDeletedRef.current = options.onMessageDeleted;
  }, [options.onMessage, options.onReadReceipt, options.onMessageDeleted]);

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Get or create WebSocket client (reuse existing connection if available)
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
        console.log("[WS][CHAT] ✅ Connected");

        // Subscribe to chat messages
        subscriptionRef.current = client.subscribe(
          "/user/queue/chat",
          (message: IMessage) => {
            try {
              const data = JSON.parse(message.body);

              // Check if it's a message or an event
              if (data.eventType) {
                // It's an event (read receipt, deletion, etc.)
                const event = data as ChatWebSocketEvent;
                if (
                  event.eventType === "CHAT_MESSAGE_READ" &&
                  onReadReceiptRef.current
                ) {
                  onReadReceiptRef.current(event);
                } else if (
                  event.eventType === "CHAT_MESSAGE_DELETED" &&
                  onMessageDeletedRef.current
                ) {
                  onMessageDeletedRef.current(event);
                }
              } else {
                // It's a message
                const messageData = data as Message;
                if (onMessageRef.current) {
                  onMessageRef.current(messageData);
                }
              }
            } catch (error) {
              console.error("[WS][CHAT] ❌ Failed to parse message:", error);
            }
          }
        );
      };

      client.onStompError = (frame) => {
        console.error(
          "[WS][CHAT] STOMP error:",
          frame.headers["message"],
          frame.body
        );
      };

      client.onWebSocketError = (event) => {
        console.error("[WS][CHAT] ❌ WebSocket Error", event);
      };

      client.onDisconnect = () => {
        console.log("[WS][CHAT] 🔌 Disconnected");
        subscriptionRef.current = null;
      };

      client.activate();
      clientRef.current = client;
      return client;
    } catch (error) {
      console.error("[WS][CHAT] ❌ Failed to connect:", error);
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Send message via WebSocket
  const sendMessage = useCallback(
    async (request: SendMessageRequest) => {
      const client = await getClient();
      if (!client || !client.connected) {
        throw new Error("WebSocket not connected");
      }

      client.publish({
        destination: "/app/chat/send",
        body: JSON.stringify({
          chatId: request.chatId,
          content: request.content,
        }),
      });
    },
    [getClient]
  );

  // Send read receipt via WebSocket
  const markAsRead = useCallback(
    async (request: MarkReadRequest) => {
      const client = await getClient();
      if (!client || !client.connected) {
        throw new Error("WebSocket not connected");
      }

      client.publish({
        destination: "/app/chat/read",
        body: JSON.stringify({
          chatId: request.chatId,
        }),
      });
    },
    [getClient]
  );

  // Initialize connection
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
    sendMessage,
    markAsRead,
    isConnected: clientRef.current?.connected ?? false,
  };
};
