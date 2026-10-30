import { personalInfo } from "../../lib/data.ts";

export interface Limits {
  chatPerMinute: number;
  chatPerDay: number;
  /** All visitors together. The OpenRouter budget on the key is the last line of defence. */
  chatGlobalPerDay: number;
  contactPerDay: number;
  contactGlobalPerDay: number;
}

export interface Config {
  port: number;
  host: string;
  production: boolean;
  openRouterKey: string | undefined;
  /** The first model answers. When it fails or stalls, the second one (or the first again) gets one more try. */
  models: string[];
  /** "deny" routes only to providers that don't store or train on the conversations. */
  dataCollection: "deny" | "allow";
  resendKey: string | undefined;
  contactTo: string;
  contactFrom: string;
  /** Origin allowed to call the API from another port, e.g. the Next dev server. */
  allowedOrigin: string | undefined;
  /** Take the visitor's IP from nginx's X-Real-IP header. Only behind the proxy. */
  trustProxy: boolean;
  knowledgeFile: string;
  limits: Limits;
}

function positive(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const production = env.NODE_ENV === "production";
  return {
    port: positive(env.PORT, 3001),
    host: env.HOST || "127.0.0.1",
    production,
    openRouterKey: env.OPENROUTER_API_KEY || undefined,
    models: (env.OPENROUTER_MODELS || "deepseek/deepseek-v4-flash")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean),
    dataCollection: env.OPENROUTER_DATA_COLLECTION === "allow" ? "allow" : "deny",
    resendKey: env.RESEND_API_KEY || undefined,
    contactTo: env.CONTACT_TO || personalInfo.email,
    contactFrom: env.CONTACT_FROM || "Filip's AI chat <chat@filip-sokolowski.pl>",
    allowedOrigin: env.ALLOWED_ORIGIN || (production ? undefined : "http://localhost:3000"),
    trustProxy: env.TRUST_PROXY === "true",
    knowledgeFile: env.KNOWLEDGE_FILE || "chat-api/knowledge/filip.md",
    limits: {
      chatPerMinute: positive(env.CHAT_PER_MINUTE, 8),
      chatPerDay: positive(env.CHAT_PER_DAY, 60),
      chatGlobalPerDay: positive(env.CHAT_GLOBAL_PER_DAY, 2000),
      contactPerDay: positive(env.CONTACT_PER_DAY, 3),
      contactGlobalPerDay: positive(env.CONTACT_GLOBAL_PER_DAY, 30),
    },
  };
}
