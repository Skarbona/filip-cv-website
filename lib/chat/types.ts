export type ChatRole = "visitor" | "assistant";

export interface ContactDraft {
  message: string;
}

/** Interactive part of an assistant message: the invoice joke or the contact form. */
export type ChatCard =
  | { type: "invoice"; excerpt: string }
  | { type: "contact"; draft: ContactDraft };

export type CardStatus = "open" | "done" | "dismissed";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  card?: ChatCard;
  cardStatus?: CardStatus;
  /** Never sent to the model, like pasted code and the invoice reply to it. */
  offRecord?: boolean;
}

/** One turn of the conversation as the model sees it. */
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatReply {
  text: string;
  card?: ChatCard;
}

export interface ChatTransport {
  send(history: ChatTurn[], signal?: AbortSignal): Promise<ChatReply>;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  /** Honeypot: people never see this field, bots tend to fill it. */
  website: string;
}

export interface ContactTransport {
  send(request: ContactRequest, signal?: AbortSignal): Promise<void>;
}
