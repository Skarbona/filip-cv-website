"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import { cn } from "@/lib/utils";
import { MAX_MESSAGE_LENGTH } from "@/lib/chat/guards";
import type { ChatMessage, ContactTransport } from "@/lib/chat/types";
import type { Chat } from "./useChat";
import InvoiceCard from "./InvoiceCard";
import ContactCard from "./ContactCard";

const SUGGESTIONS = [
  "What do you do at Mercor?",
  "Are you open to new projects?",
  "How do you work from a camper?",
];

// The visitor sends this as their own message, so it speaks in their voice
function invoiceRequest(invoiceTo: string, excerpt: string) {
  return `Hi Filip, I'd like paid help with this code.\nInvoice to: ${invoiceTo}\n\nMy code:\n${excerpt}`;
}

function Bubble({ message, children }: { message: ChatMessage; children?: ReactNode }) {
  const fromVisitor = message.role === "visitor";
  return (
    <div className={cn("flex", fromVisitor ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] px-3 py-2 text-sm shadow-(--pixel-box-shadow) box-shadow-margin",
          fromVisitor
            ? "bg-blue-600 text-white"
            : "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
        )}
      >
        <span className="sr-only">{fromVisitor ? "You:" : "Filip's AI:"}</span>
        <p className="break-words whitespace-pre-wrap">{message.text}</p>
        {children}
      </div>
    </div>
  );
}

interface ChatWindowProps {
  chat: Chat;
  contactTransport: ContactTransport;
}

export default function ChatWindow({ chat, contactTransport }: ChatWindowProps) {
  const { messages, thinking, limitReached, send, openContact, closeCard } = chat;
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const started = messages.some((message) => message.role === "visitor");

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, thinking]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!draft.trim() || thinking) return;
    void send(draft);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const renderCard = (message: ChatMessage) => {
    if (message.cardStatus !== "open" || !message.card) return null;
    if (message.card.type === "invoice") {
      const { excerpt } = message.card;
      return (
        <InvoiceCard
          onContinue={(invoiceTo) => {
            closeCard(message.id, "done");
            openContact(invoiceRequest(invoiceTo, excerpt));
          }}
          onDismiss={() =>
            closeCard(message.id, "dismissed", "No problem! Ask me anything about Filip instead.")
          }
        />
      );
    }
    return (
      <ContactCard
        draft={message.card.draft}
        transport={contactTransport}
        onSent={() =>
          closeCard(message.id, "done", "Sent! Filip usually replies within 24-48 hours.")
        }
        onCancel={() => closeCard(message.id, "dismissed", "Okay, nothing was sent.")}
      />
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={listRef} aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <Bubble key={message.id} message={message}>
            {renderCard(message)}
          </Bubble>
        ))}

        {thinking && (
          <p className="pixel-font animate-pulse text-[10px] text-muted-foreground">
            Filip is typing...
          </p>
        )}

        {!started && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                size="sm"
                variant="secondary"
                className="h-auto py-2 text-[10px] whitespace-normal"
                onClick={() => void send(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              className="h-auto py-2 text-[10px] whitespace-normal"
              onClick={() => openContact()}
            >
              Contact Filip
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className="flex items-end gap-3 border-t-4 border-black p-3 dark:border-ring"
      >
        <label htmlFor="chat-input" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={2}
          disabled={limitReached}
          placeholder={limitReached ? "This chat is full" : "Ask me anything about Filip..."}
          className="max-h-32 min-h-11 flex-1 resize-none bg-white px-3 py-2 text-sm text-slate-900 shadow-(--pixel-box-shadow) box-shadow-margin outline-none [field-sizing:content] focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100"
        />
        <Button type="submit" disabled={!draft.trim() || thinking || limitReached}>
          Send
        </Button>
      </form>
      {draft.length > MAX_MESSAGE_LENGTH - 200 && (
        <p className="px-4 pb-2 text-right text-xs text-muted-foreground">
          {draft.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  );
}
