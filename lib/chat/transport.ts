import { createHttpTransports } from "./httpTransport";
import { mockChatTransport, mockContactTransport } from "./mockTransport";

// In `next dev` the API runs on its own port (npm run chat-api:dev). In production nginx serves
// it under /api on the same domain, so the base URL is empty.
const apiUrl =
  process.env.NEXT_PUBLIC_CHAT_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

// NEXT_PUBLIC_CHAT_MOCK=true answers in the browser, without the API.
const useMock = process.env.NEXT_PUBLIC_CHAT_MOCK === "true";
const http = createHttpTransports(apiUrl);

export const chatTransport = useMock ? mockChatTransport : http.chat;
export const contactTransport = useMock ? mockContactTransport : http.contact;
