"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_MESSAGE_LENGTH, MAX_VISITOR_MESSAGES, looksLikeCode } from "@/lib/chat/guards";
import { REPLIES } from "@/lib/chat/replies";
import type { CardStatus, ChatMessage, ChatTransport, ChatTurn } from "@/lib/chat/types";

export const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  text: REPLIES.greeting,
};

function toTurn(message: ChatMessage): ChatTurn {
  return { role: message.role === "visitor" ? "user" : "assistant", content: message.text };
}

export function useChat(transport: ChatTransport) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [thinking, setThinking] = useState(false);
  const lastId = useRef(0);
  const busy = useRef(false);
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => pending.current?.abort(), []);

  const nextId = useCallback(() => `m${++lastId.current}`, []);

  const append = useCallback(
    (...items: ChatMessage[]) => setMessages((current) => [...current, ...items]),
    []
  );

  const contactMessage = useCallback(
    (text: string, message = ""): ChatMessage => ({
      id: nextId(),
      role: "assistant",
      text,
      card: { type: "contact", draft: { message } },
      cardStatus: "open",
    }),
    [nextId]
  );

  const asked = messages.filter((message) => message.role === "visitor").length;
  const limitReached = asked >= MAX_VISITOR_MESSAGES;

  const send = useCallback(
    async (input: string) => {
      const text = input.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || busy.current || limitReached) return;

      const question: ChatMessage = { id: nextId(), role: "visitor", text };
      const lastQuestion = asked + 1 >= MAX_VISITOR_MESSAGES;
      const limitNotice = () => (lastQuestion ? [contactMessage(REPLIES.limit)] : []);

      if (looksLikeCode(text)) {
        // Pasted code goes straight to the invoice joke and stays out of the model's history
        append(
          { ...question, offRecord: true },
          {
            id: nextId(),
            role: "assistant",
            text: REPLIES.invoice,
            card: { type: "invoice", excerpt: text.slice(0, 400) },
            cardStatus: "open",
            offRecord: true,
          },
          ...limitNotice()
        );
        return;
      }

      const history = [...messages, question]
        .filter((message) => message.id !== GREETING.id && !message.offRecord)
        .map(toTurn);
      append(question);
      busy.current = true;
      setThinking(true);
      const controller = new AbortController();
      pending.current = controller;

      let answer: ChatMessage;
      try {
        const reply = await transport.send(history, controller.signal);
        answer = {
          id: nextId(),
          role: "assistant",
          text: reply.text,
          card: reply.card,
          cardStatus: reply.card ? "open" : undefined,
          // The server may catch code the browser missed; keep it out of later requests too
          offRecord: reply.card?.type === "invoice",
        };
      } catch {
        answer = { id: nextId(), role: "assistant", text: REPLIES.error };
      } finally {
        busy.current = false;
        setThinking(false);
      }
      if (controller.signal.aborted) return;
      if (answer.offRecord) {
        setMessages((current) =>
          current.map((message) =>
            message.id === question.id ? { ...message, offRecord: true } : message
          )
        );
      }
      append(answer, ...limitNotice());
    },
    [append, asked, contactMessage, limitReached, messages, nextId, transport]
  );

  const openContact = useCallback(
    (message = "") => append(contactMessage(REPLIES.contact, message)),
    [append, contactMessage]
  );

  /** Closes a card and optionally adds a short reply under it. */
  const closeCard = useCallback(
    (id: string, status: CardStatus, note?: string) => {
      const reply: ChatMessage[] = note ? [{ id: nextId(), role: "assistant", text: note }] : [];
      setMessages((current) => [
        ...current.map((message) =>
          message.id === id ? { ...message, cardStatus: status } : message
        ),
        ...reply,
      ]);
    },
    [nextId]
  );

  return { messages, thinking, limitReached, send, openContact, closeCard };
}

export type Chat = ReturnType<typeof useChat>;
