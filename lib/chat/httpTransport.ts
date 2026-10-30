import type { ChatReply, ChatTransport, ContactTransport } from "./types";

export class ChatApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
  }
}

async function post(url: string, body: unknown, signal?: AbortSignal) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const data: Record<string, unknown> | null = await response.json().catch(() => null);
  return { response, data };
}

function isReply(
  data: Record<string, unknown> | null
): data is Record<string, unknown> & ChatReply {
  return typeof data?.text === "string";
}

/** Talks to the chat API (chat-api/ in this repo). */
export function createHttpTransports(baseUrl: string): {
  chat: ChatTransport;
  contact: ContactTransport;
} {
  return {
    chat: {
      async send(history, signal) {
        const { response, data } = await post(`${baseUrl}/api/chat`, { messages: history }, signal);
        // Rate limits still come with a friendly answer to show
        if ((response.ok || response.status === 429) && isReply(data)) {
          const card =
            data.card?.type === "invoice" || data.card?.type === "contact" ? data.card : undefined;
          return { text: data.text, card };
        }
        throw new ChatApiError(response.status, String(data?.error ?? "Chat API error"));
      },
    },
    contact: {
      async send(request, signal) {
        const { response, data } = await post(`${baseUrl}/api/contact`, request, signal);
        if (!response.ok) {
          throw new ChatApiError(response.status, String(data?.error ?? "Contact API error"));
        }
      },
    },
  };
}
