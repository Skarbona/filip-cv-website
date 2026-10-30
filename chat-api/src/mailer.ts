import type { ContactRequest } from "../../lib/chat/types.ts";

export interface Mailer {
  send(request: ContactRequest): Promise<void>;
}

interface ResendOptions {
  apiKey: string;
  from: string;
  to: string;
  fetchImpl?: typeof fetch;
}

function oneLine(text: string) {
  return text.replace(/[\r\n]+/g, " ").slice(0, 80);
}

/** Emails Filip through Resend. The recipient is fixed here, so visitors can't send mail anywhere else. */
export function createResendMailer({ apiKey, from, to, fetchImpl = fetch }: ResendOptions): Mailer {
  return {
    async send({ name, email, message }) {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Chat: message from ${oneLine(name)}`,
          text: `${message}\n\n---\n${name} <${email}>\nSent from the AI chat on filip-sokolowski.pl. Reply to this email to answer.`,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        // Resend says why, e.g. an unverified sender domain. Only the log sees it, never the visitor.
        const reason = await response
          .json()
          .then((body) =>
            typeof body?.message === "string" ? `: ${body.message.slice(0, 200)}` : ""
          )
          .catch(() => "");
        throw new Error(`Resend responded with ${response.status}${reason}`);
      }
    },
  };
}

/** Used when there is no Resend key: prints the message instead of sending it. */
export const consoleMailer: Mailer = {
  async send({ name, email, message }) {
    console.info(
      `[contact] RESEND_API_KEY is not set, nothing was emailed. ${name} <${email}>:\n${message}`
    );
  },
};
