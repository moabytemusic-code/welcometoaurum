"use client";

import React, { useState, useEffect } from "react";

export default function ChatWidgetEmbed({ 
  welcomeMessage = "Hello! Welcome to Aurum Rise. Are you ready to unlock the Syllabus?",
  delaySeconds = 0
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasGreeting, setHasGreeting] = useState(true);
  const [isVisible, setIsVisible] = useState(delaySeconds === 0);
  const iframeRef = React.useRef(null);

  useEffect(() => {
    if (delaySeconds > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delaySeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [delaySeconds]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "aurum_chat_toggle") {
        setIsOpen(event.data.isOpen);
        if (event.data.showGreeting !== undefined) {
          setHasGreeting(event.data.showGreeting);
        }
        if (event.data.isOpen && iframeRef.current && iframeRef.current.contentWindow) {
          // Tell the actual chatbot app inside the iframe to open
          iframeRef.current.contentWindow.postMessage({ type: 'aurum_chat_open' }, '*');
        }
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'aurum_chat_open' }, '*');
      }
    };

    const handleCustomClose = () => {
      setIsOpen(false);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'aurum_chat_close' }, '*');
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("open_aurum_chatbot", handleCustomOpen);
    window.addEventListener("close_aurum_chatbot", handleCustomClose);
    
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("open_aurum_chatbot", handleCustomOpen);
      window.removeEventListener("close_aurum_chatbot", handleCustomClose);
    };
  }, []);

  const encodedWelcome = encodeURIComponent(welcomeMessage);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 9999,
        // When open: full viewport so chat panel + backdrop aren't clipped
        // When closed: area large enough to show the floating button AND the speech bubble above it
        width: isOpen ? "100vw" : "300px",
        height: isOpen ? "100vh" : (hasGreeting ? "250px" : "100px"),
        transition: isOpen
          ? "none" // Open instantly so panel isn't clipped during transition
          : "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        pointerEvents: "none", // Let pointer events pass through container
      }}
    >
      <iframe
        ref={iframeRef}
        src={`/chat?embed=true&welcome=${encodedWelcome}`}
        title="Neo AI"
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
