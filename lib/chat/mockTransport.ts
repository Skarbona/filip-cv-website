// The .ts extension lets the chat API import this file too: Node needs it, bundlers don't mind
import { REPLIES } from "./replies.ts";
import type { ChatTransport, ContactTransport } from "./types";

// Local stand-ins that send nothing anywhere. The browser uses them with NEXT_PUBLIC_CHAT_MOCK=true,
// the API when it runs without an OpenRouter key.

const CONTACT_INTENT =
  /\b(?:contact|reach|hire|e-?mail|get in touch|talk to)\b|kontakt|skontaktuj|napisz do|zatrudni/i;

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export const mockChatTransport: ChatTransport = {
  async send(history, signal) {
    await wait(600 + Math.random() * 600, signal);
    const question = history[history.length - 1]?.content ?? "";
    if (CONTACT_INTENT.test(question)) {
      return { text: REPLIES.contact, card: { type: "contact", draft: { message: "" } } };
    }
    return {
      text: "Beep boop 🤖 My AI brain isn't plugged in yet, so I can't really answer. Soon I'll know all about my work, my travels and my camper office.",
    };
  },
};

export const mockContactTransport: ContactTransport = {
  async send(_request, signal) {
    await wait(700, signal);
  },
};
