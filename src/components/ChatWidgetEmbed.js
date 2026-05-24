"use client";

import React, { useState, useEffect } from "react";

export default function ChatWidgetEmbed() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "aurum_chat_toggle") {
        setIsOpen(event.data.isOpen);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 9999,
        // When open: full viewport so chat panel + backdrop aren't clipped
        // When closed: small area for just the floating button
        width: isOpen ? "100vw" : "96px",
        height: isOpen ? "100vh" : "96px",
        transition: isOpen
          ? "none" // Open instantly so panel isn't clipped during transition
          : "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        pointerEvents: "none", // Let pointer events pass through container
      }}
    >
      <iframe
        src="/chat?embed=true"
        title="Aurum AI Chatbot"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "transparent",
          pointerEvents: "auto", // Re-enable pointer events on the iframe itself
        }}
        allow="microphone"
      />
    </div>
  );
}
