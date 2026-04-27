// src/socket/socketClient.js
import { API_ENDPOINTS } from "@/config/apiConfig";
import { io } from "socket.io-client";

export const createSocket = (
  idToken,
  { onConnect, onDisconnect, onError, onStateChange } = {}
) => {
  if (!idToken) return null;

  const socketClient = io(API_ENDPOINTS.socketUrl, {
    transports: ["websocket"],
    auth: { token: idToken },
    autoConnect: false,
    // ✅ RECONNECT CONFIG
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  // Trạng thái kết nối
  socketClient.on("connect", () => {
    console.log("Socket connected:", socketClient.id);
    onStateChange?.("connected");
    onConnect?.(socketClient);
  });

  socketClient.on("disconnect", (reason) => {
    console.log("Socket disconnected", reason);
    onStateChange?.("connecting");
    onDisconnect?.(reason);
  });

  socketClient.on("connect_error", (err) => {
    console.error("Connect error:", err.message);
    onStateChange?.("unavailable");
    onError?.(err);
  });

  socketClient.io.on("reconnect_attempt", () => {
    onStateChange?.("connecting");
  });

  socketClient.io.on("reconnect", () => {
    onStateChange?.("connected");
  });

  socketClient.io.on("reconnect_error", () => {
    onStateChange?.("unavailable");
  });

  socketClient.io.on("reconnect_failed", () => {
    onStateChange?.("unavailable");
  });

  onStateChange?.("connecting");
  socketClient.connect();
  return socketClient;
};
