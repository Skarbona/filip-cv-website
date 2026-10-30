"use client";

import { useEffect, useState } from "react";
import { chatTransport, contactTransport } from "@/lib/chat/transport";
import type { ChatTransport, ContactTransport } from "@/lib/chat/types";
import { useChat } from "./useChat";
import ChatLauncher from "./ChatLauncher";
import ChatModal from "./ChatModal";
import ChatWindow from "./ChatWindow";

const AUTO_OPEN_KEY = "chat:auto-opened";
const AUTO_OPEN_DELAY_MS = 3000;

/** Marks the auto-open as used for this session. Returns true if it was already used. */
function claimAutoOpen() {
  try {
    if (window.sessionStorage.getItem(AUTO_OPEN_KEY)) return true;
    window.sessionStorage.setItem(AUTO_OPEN_KEY, "1");
    return false;
  } catch {
    // Storage blocked: better never than every page load
    return true;
  }
}

interface ChatWidgetProps {
  transport?: ChatTransport;
  contact?: ContactTransport;
}

export default function ChatWidget({
  transport = chatTransport,
  contact = contactTransport,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const chat = useChat(transport);

  useEffect(() => {
    // Opens by itself once per session, and only on wide screens:
    // on phones a pop-up over the page annoys people and search engines alike
    const timer = window.setTimeout(() => {
      if (!window.matchMedia?.("(min-width: 768px)").matches) return;
      if (claimAutoOpen()) return;
      setOpen(true);
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const openChat = () => {
    claimAutoOpen();
    setOpen(true);
  };

  return (
    <>
      {!open && <ChatLauncher onOpen={openChat} />}
      <ChatModal open={open} onClose={() => setOpen(false)} thinking={chat.thinking}>
        <ChatWindow chat={chat} contactTransport={contact} />
      </ChatModal>
    </>
  );
}
