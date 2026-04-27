import React from "react";

const SocketStatus = ({ socketState = "idle" }) => {
  const isConnected = socketState === "connected";
  const isConnecting = socketState === "connecting";
  const statusClass = isConnected
    ? "status-success"
    : isConnecting
      ? "status-info"
      : "status-warning";

  return (
    <div className="flex items-center gap-2">
      <div className="inline-grid *:[grid-area:1/1]">
        <div
          className={`status ${statusClass} ${isConnected || isConnecting ? "animate-ping" : ""
            }`}
        ></div>
        <div className={`status ${statusClass}`}></div>
      </div>
      <span
        className={
          isConnected
            ? "text-success"
            : isConnecting
              ? "text-info"
              : "text-warning"
        }
      >
        {isConnected
          ? "Realtime: Connected"
          : isConnecting
            ? "Realtime: Connecting"
            : "Realtime: Unavailable"}
      </span>
    </div>
  );
};

export default SocketStatus;
