"use client";

import React, { useState, useEffect } from "react";

export default function ChatWidgetEmbed() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      // Safety check: confirm the message structure is what we expect
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
        bottom: "16px",
        right: "16px",
        zIndex: 9999,
        width: isOpen ? "420px" : "90px",
        height: isOpen ? "650px" : "90px",
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "calc(100vh - 32px)",
        transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        borderRadius: isOpen ? "24px" : "50%",
        pointerEvents: "none" // Let pointer events pass through container
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
          colorScheme: "dark"
        }}
        allow="microphone" // Enable voice input/speech recognition in the iframe
      />
    </div>
  );
}
