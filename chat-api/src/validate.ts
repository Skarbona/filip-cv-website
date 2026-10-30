import { MAX_MESSAGE_LENGTH, MAX_VISITOR_MESSAGES } from "../../lib/chat/guards.ts";
import type { ChatTurn, ContactRequest } from "../../lib/chat/types.ts";

const MAX_TURNS = MAX_VISITOR_MESSAGES * 3;
const MAX_ASSISTANT_LENGTH = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

function fail<T>(error: string): Parsed<T> {
  return { ok: false, error };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Checks the conversation the browser sends. Nothing in it is trusted beyond its shape. */
export function parseChat(body: unknown): Parsed<ChatTurn[]> {
  if (!isRecord(body) || !Array.isArray(body.messages)) return fail("messages must be an array");
  if (body.messages.length === 0 || body.messages.length > MAX_TURNS) {
    return fail("wrong number of messages");
  }

  const turns: ChatTurn[] = [];
  for (const message of body.messages) {
    if (!isRecord(message)) return fail("every message must be an object");
    const { role, content } = message;
    if (role !== "user" && role !== "assistant") return fail("role must be user or assistant");
    if (typeof content !== "string" || !content.trim()) return fail("content must be text");
    const limit = role === "user" ? MAX_MESSAGE_LENGTH : MAX_ASSISTANT_LENGTH;
    if (content.length > limit) return fail(`${role} message is longer than ${limit} characters`);
    turns.push({ role, content });
  }

  if (turns[turns.length - 1].role !== "user") return fail("the last message must be the user's");
  return { ok: true, value: turns };
}

export function parseContact(body: unknown): Parsed<ContactRequest> {
  if (!isRecord(body)) return fail("body must be an object");
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  if (!name || name.length > 100) return fail("name must have 1-100 characters");
  if (!EMAIL.test(email) || email.length > 200) return fail("email is not valid");
  if (!message || message.length > 4000) return fail("message must have 1-4000 characters");
  return { ok: true, value: { name, email, message, website: text(body.website) } };
}
