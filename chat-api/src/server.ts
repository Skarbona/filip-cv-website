import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { MAX_VISITOR_MESSAGES, looksLikeCode } from "../../lib/chat/guards.ts";
import { REPLIES } from "../../lib/chat/replies.ts";
import type { ChatReply, ChatTurn } from "../../lib/chat/types.ts";
import type { Config } from "./config.ts";
import { looksLikeInjection } from "./injection.ts";
import { LlmError, type Llm } from "./llm.ts";
import type { Mailer } from "./mailer.ts";
import { RateLimiter } from "./rateLimit.ts";
import { parseChat, parseContact } from "./validate.ts";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const MAX_BODY_BYTES = 32 * 1024;
/** Turns sent to the model. Older ones are dropped to keep every answer cheap. */
const MAX_HISTORY = 12;

type LogEntry = Record<string, unknown>;

export interface Deps {
  config: Config;
  llm: Llm;
  mailer: Mailer;
  systemPrompt: string;
  now?: () => number;
  log?: (entry: LogEntry) => void;
}

class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function send(res: ServerResponse, status: number, body?: unknown) {
  res.statusCode = status;
  if (body === undefined) {
    res.end();
    return;
  }
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  if (!req.headers["content-type"]?.startsWith("application/json")) {
    throw new HttpError(415, "Send JSON");
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, "Body too large");
    chunks.push(chunk as Buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
}

function setHeaders(req: IncomingMessage, res: ServerResponse, allowedOrigin: string | undefined) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Vary", "Origin");
  if (allowedOrigin && req.headers.origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
  }
}

function clientIp(req: IncomingMessage, trustProxy: boolean) {
  const forwarded = req.headers["x-real-ip"];
  if (trustProxy && typeof forwarded === "string" && forwarded) return forwarded;
  return req.socket.remoteAddress ?? "unknown";
}

/** The last few turns, starting with a question: some providers reject a chat that opens with the assistant. */
function recent(turns: ChatTurn[]) {
  const tail = turns.slice(-MAX_HISTORY);
  return tail.slice(tail.findIndex((turn) => turn.role === "user"));
}

const contactCard = (): ChatReply["card"] => ({ type: "contact", draft: { message: "" } });

export function createApp({
  config,
  llm,
  mailer,
  systemPrompt,
  now = Date.now,
  log = (entry) => console.log(JSON.stringify(entry)),
}: Deps): Server {
  const limiter = new RateLimiter();
  const { limits } = config;

  async function chat(req: IncomingMessage, res: ServerResponse, entry: LogEntry) {
    const parsed = parseChat(await readJson(req));
    if (!parsed.ok) return send(res, 400, { error: parsed.error });

    const ip = clientIp(req, config.trustProxy);
    const blocked = limiter.take(
      [
        { key: `chat:minute:${ip}`, limit: limits.chatPerMinute, windowMs: MINUTE },
        { key: `chat:day:${ip}`, limit: limits.chatPerDay, windowMs: DAY },
        { key: "chat:day", limit: limits.chatGlobalPerDay, windowMs: DAY },
      ],
      now()
    );
    if (blocked) {
      entry.outcome = "rate-limited";
      res.setHeader("Retry-After", String(blocked.retryAfterSeconds));
      const everyone = blocked.key === "chat:day";
      return send(
        res,
        429,
        everyone ? { text: REPLIES.closed, card: contactCard() } : { text: REPLIES.busy }
      );
    }

    const reply = (outcome: string, body: ChatReply) => {
      entry.outcome = outcome;
      send(res, 200, body);
    };

    const turns = parsed.value;
    const questions = turns.filter((turn) => turn.role === "user");
    if (questions.length > MAX_VISITOR_MESSAGES) {
      return reply("limit", { text: REPLIES.limit, card: contactCard() });
    }

    // Pasted code never reaches the model, even if an earlier message slipped past the browser
    const code = questions.find((turn) => looksLikeCode(turn.content));
    if (code) {
      return reply("invoice", {
        text: REPLIES.invoice,
        card: { type: "invoice", excerpt: code.content.slice(0, 400) },
      });
    }
    if (looksLikeInjection(questions[questions.length - 1].content)) {
      return reply("injection", { text: REPLIES.injection });
    }

    try {
      const result = await llm.reply(systemPrompt, recent(turns));
      Object.assign(entry, {
        outcome: "answered",
        model: result.model,
        cost: result.cost,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        retried: result.retried,
      });
      return send(res, 200, result.reply);
    } catch (error) {
      // 402: no credits left, 403: the monthly budget on the key is used up
      if (error instanceof LlmError && (error.status === 402 || error.status === 403)) {
        entry.error = error.message;
        return reply("out-of-budget", { text: REPLIES.closed, card: contactCard() });
      }
      throw error;
    }
  }

  async function contact(req: IncomingMessage, res: ServerResponse, entry: LogEntry) {
    const parsed = parseContact(await readJson(req));
    if (!parsed.ok) return send(res, 400, { error: parsed.error });

    const ip = clientIp(req, config.trustProxy);
    const blocked = limiter.take(
      [
        { key: `contact:day:${ip}`, limit: limits.contactPerDay, windowMs: DAY },
        { key: "contact:day", limit: limits.contactGlobalPerDay, windowMs: DAY },
      ],
      now()
    );
    if (blocked) {
      entry.outcome = "rate-limited";
      res.setHeader("Retry-After", String(blocked.retryAfterSeconds));
      return send(res, 429, {
        error: "That's enough messages for today. Try email or LinkedIn instead.",
      });
    }

    // People never see this field, bots fill it. Let them think it worked.
    if (parsed.value.website) {
      entry.outcome = "honeypot";
      return send(res, 200, { ok: true });
    }

    await mailer.send(parsed.value);
    entry.outcome = "sent";
    send(res, 200, { ok: true });
  }

  const server = createServer(async (req, res) => {
    const started = now();
    const path = new URL(req.url ?? "/", "http://localhost").pathname;
    // No IPs and no message content in the logs
    const entry: LogEntry = { method: req.method, path };

    try {
      setHeaders(req, res, config.allowedOrigin);
      if (req.method === "OPTIONS") return send(res, 204);
      if (req.method === "GET" && path === "/api/health") return send(res, 200, { ok: true });
      if (req.method === "POST" && path === "/api/chat") return await chat(req, res, entry);
      if (req.method === "POST" && path === "/api/contact") return await contact(req, res, entry);
      send(res, 404, { error: "Not found" });
    } catch (error) {
      if (error instanceof HttpError) return send(res, error.status, { error: error.message });
      entry.error = error instanceof Error ? error.message : String(error);
      send(res, 502, { error: "Something went wrong, try again in a moment." });
    } finally {
      if (path !== "/api/health" && req.method !== "OPTIONS") {
        log({ ...entry, status: res.statusCode, ms: now() - started });
      }
    }
  });

  server.requestTimeout = 30_000;
  server.headersTimeout = 15_000;
  return server;
}
