import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuth0 } from "@auth0/auth0-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { Notification } from "@/types/notification";
import { env } from "@/lib/env";

export const useWebSocket = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const { addNotification, incrementUnreadCount, setIsConnected } =
    useNotificationStore();
  const clientRef = useRef<Client | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (clientRef.current?.connected) {
      return;
    }

    if (!isAuthenticated) {
      // Clean up if not authenticated
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

    isConnectingRef.current = true;

    const connect = async () => {
      try {
        const token = await getAccessTokenSilently();

        // Try native WebSocket first (Recommended)
        // Convert http:// to ws://
        const wsUrl =
          env.API_URL.replace("/api", "").replace("http://", "ws://") +
          "/ws-native";

        const client = new Client({
          brokerURL: wsUrl,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          // debug: (str) => {
          //   console.log("[STOMP] Debug:", str);
          // },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          // Since we are using native WebSocket, we don't need webSocketFactory
        });

        // Debug callback for the actual WebSocket
        client.onWebSocketError = (event) => {
          console.error("[WS] ❌ WebSocket Error Details:", event);
        };

        client.onWebSocketClose = (event) => {
          console.warn("[WS] ⚠️ WebSocket closed:", event);
        };

        client.onConnect = (frame) => {
          console.log("[WS] ✅ STOMP CONNECTED");
          isConnectingRef.current = false;
          setIsConnected(true);

          client.publish({
            destination: "/app/ping",
            body: "hello from frontend",
          });

          client.subscribe("/user/queue/notifications", (message: IMessage) => {
            try {
              const notification: Notification = JSON.parse(message.body);

              addNotification(notification);
              incrementUnreadCount();
            } catch (error) {
              console.error("[WS] ❌ Failed to parse notification:", error);
            }
          });
        };

        client.onStompError = (frame) => {
          console.error(
            "[WS] STOMP error:",
            frame.headers["message"],
            frame.body
          );
          isConnectingRef.current = false;
          setIsConnected(false);
        };

        client.onWebSocketError = (event) => {
          console.error("[WS] ❌ WebSocket Error", event);
          isConnectingRef.current = false;
          setIsConnected(false);
        };

        client.onDisconnect = () => {
          console.log("[WS] 🔌 STOMP DISCONNECTED");
          isConnectingRef.current = false;
          setIsConnected(false);
        };

        client.activate();
        clientRef.current = client;

        console.log("[WS] Client activation initiated");
      } catch (error) {
        console.error("[WS] ❌ Failed to connect:", error);
        isConnectingRef.current = false;
        setIsConnected(false);
      }
    };

    connect();
  }, [isAuthenticated, user?.sub]);
};
