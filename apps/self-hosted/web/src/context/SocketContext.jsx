import { createSocket } from "@/socket/socketClient";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuthStore();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketState, setSocketState] = useState("idle");

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken || !user?.uid) return;

    // ❗ Chỉ tạo socket nếu chưa có
    if (!socketRef.current) {
      setSocketState("connecting");
      socketRef.current = createSocket(idToken, {
        onConnect: () => {
          setIsConnected(true);
          setSocketState("connected");
        },
        onDisconnect: () => {
          setIsConnected(false);
        },
        onError: () => {
          setIsConnected(false);
          setSocketState("unavailable");
        },
        onStateChange: (state) => {
          setSocketState(state);
          if (state === "connected") setIsConnected(true);
          if (state === "unavailable") setIsConnected(false);
        },
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setSocketState("idle");
    };
  }, [user?.uid]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        socketState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
