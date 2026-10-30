import { mockChatTransport } from "../../lib/chat/mockTransport.ts";
import { REPLIES } from "../../lib/chat/replies.ts";
import type { ChatReply, ChatTurn } from "../../lib/chat/types.ts";

export interface LlmResult {
  reply: ChatReply;
  model?: string;
  /** In USD, as reported by OpenRouter. */
  cost?: number;
  promptTokens?: number;
  completionTokens?: number;
  /** Why the first try failed, when the answer came from the second one. */
  retried?: string;
}

export interface Llm {
  reply(system: string, turns: ChatTurn[]): Promise<LlmResult>;
}

export class LlmError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "LlmError";
    this.status = status;
  }
}

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export const CONTACT_TOOL = {
  type: "function",
  function: {
    name: "request_contact",
    description:
      "Shows the visitor a form to email Filip, filled in with your draft of their message. Use it when they want to contact, hire or meet him, or ask something only he can answer.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description:
            "The visitor's message to Filip, written as they would write it: their voice and language, one or two sentences, only what they said. They can edit it before sending. Example: \"Hi Filip, I'd like to talk about a backend role in my team.\"",
        },
      },
      required: ["message"],
    },
  },
} as const;

interface Completion {
  model?: string;
  choices?: {
    message?: {
      content?: string | null;
      tool_calls?: { function?: { name?: string; arguments?: string } }[];
    };
  }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
  error?: { message?: string; metadata?: { provider_name?: string } };
}

interface OpenRouterOptions {
  apiKey: string;
  /** The first one answers. When it fails or stalls, the second one (or the first again) gets one more try. */
  models: string[];
  dataCollection: "deny" | "allow";
  fetchImpl?: typeof fetch;
  /** Per try. A failed try gets one more, so a visitor waits at most about twice this. */
  timeoutMs?: number;
}

/** Worth one more try: a slow or failing provider. A spent budget or a bad request would fail again. */
const RETRYABLE = new Set([408, 500, 502, 503, 504]);

/**
 * Models that refuse to switch thinking off ("Reasoning is mandatory"). Their lowest setting
 * costs a few tokens. DeepSeek is the opposite: any setting above none uses up the whole answer.
 */
const MANDATORY_REASONING = new Set(["z-ai/glm-5.3-flash"]);

function failureReason(response: Response, data: Completion | null) {
  if (data?.error?.message) {
    const provider = data.error.metadata?.provider_name;
    return provider ? `${data.error.message} (${provider})` : data.error.message;
  }
  return response.ok
    ? "OpenRouter sent an unreadable answer"
    : `OpenRouter responded with ${response.status}`;
}

function draftOf(json: string | undefined): string {
  try {
    const { message } = JSON.parse(json ?? "{}");
    return typeof message === "string" ? message.slice(0, 1000) : "";
  } catch {
    return "";
  }
}

export function createOpenRouter({
  apiKey,
  models,
  dataCollection,
  fetchImpl = fetch,
  timeoutMs = 12_000,
}: OpenRouterOptions): Llm {
  const [primary, fallback = primary] = models;

  // One model per try, because the two need different thinking settings
  async function attempt(model: string, system: string, turns: ChatTurn[]): Promise<LlmResult> {
    const signal = AbortSignal.timeout(timeoutMs);
    const timedOut = () => new LlmError(504, `OpenRouter timed out after ${timeoutMs / 1000} s`);

    let response: Response;
    try {
      response = await fetchImpl(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://filip-sokolowski.pl",
          "X-Title": "Filip's AI twin",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: system }, ...turns],
          max_completion_tokens: 400,
          temperature: 0.6,
          // A chat about a CV doesn't need thinking tokens, which cost money and time
          reasoning: { effort: MANDATORY_REASONING.has(model) ? "minimal" : "none" },
          tools: [CONTACT_TOOL],
          // Default routing on purpose: sorting by speed picked providers up to 20 times pricier
          provider: { data_collection: dataCollection },
        }),
        signal,
      });
    } catch (error) {
      if (signal.aborted) throw timedOut();
      throw new LlmError(504, `OpenRouter did not answer: ${(error as Error).message}`);
    }

    // OpenRouter sends 200 as soon as a provider takes the request, so a provider that stalls
    // or fails after that shows up only here, while the body arrives
    const data = (await response.json().catch(() => null)) as Completion | null;
    if (!data && signal.aborted) throw timedOut();
    if (!response.ok || !data || data.error) {
      throw new LlmError(response.ok ? 502 : response.status, failureReason(response, data));
    }

    const message = data.choices?.[0]?.message;
    const text = message?.content?.trim() ?? "";
    const usage = {
      model: data.model,
      cost: data.usage?.cost,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
    };

    const contact = message?.tool_calls?.find((call) => call.function?.name === "request_contact");
    if (contact) {
      return {
        ...usage,
        reply: {
          text: text || REPLIES.contact,
          card: { type: "contact", draft: { message: draftOf(contact.function?.arguments) } },
        },
      };
    }
    if (!text) throw new LlmError(502, "OpenRouter returned an empty answer");
    return { ...usage, reply: { text: text.slice(0, 2000) } };
  }

  return {
    async reply(system, turns) {
      try {
        return await attempt(primary, system, turns);
      } catch (first) {
        if (!(first instanceof LlmError) || !RETRYABLE.has(first.status)) throw first;
        // The visitor is still waiting, so one more try before giving up
        try {
          return { ...(await attempt(fallback, system, turns)), retried: first.message };
        } catch (second) {
          if (!(second instanceof LlmError)) throw second;
          throw new LlmError(second.status, `${first.message}; retry: ${second.message}`);
        }
      }
    },
  };
}

/** Used when there is no OpenRouter key, so the whole flow can run locally for free. */
export const cannedLlm: Llm = {
  async reply(_system, turns) {
    return { model: "canned", reply: await mockChatTransport.send(turns) };
  },
};
