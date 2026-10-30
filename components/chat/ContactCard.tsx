"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import { ChatApiError } from "@/lib/chat/httpTransport";
import type { ContactDraft, ContactTransport } from "@/lib/chat/types";
import { inputClassName } from "./inputClassName";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_FAILED = "Couldn't send it. Try again in a moment.";

interface ContactCardProps {
  draft: ContactDraft;
  transport: ContactTransport;
  onSent: () => void;
  onCancel: () => void;
}

export default function ContactCard({ draft, transport, onSent, onCancel }: ContactCardProps) {
  const [form, setForm] = useState({ name: "", email: "", message: draft.message, website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [failure, setFailure] = useState(SEND_FAILED);

  const ready = form.name.trim() && EMAIL.test(form.email.trim()) && form.message.trim();

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      await transport.send({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      onSent();
    } catch (error) {
      // The daily limit comes with its own explanation
      setFailure(
        error instanceof ChatApiError && error.status === 429 ? error.message : SEND_FAILED
      );
      setStatus("failed");
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <p className="text-xs">
        This sends an email to Filip. Nothing goes out until you click Send.
      </p>
      <label className="block text-xs">
        Your name
        <input
          value={form.name}
          onChange={(event) => update("name")(event.target.value)}
          autoComplete="name"
          className={inputClassName}
        />
      </label>
      <label className="block text-xs">
        Your email
        <input
          type="email"
          value={form.email}
          onChange={(event) => update("email")(event.target.value)}
          autoComplete="email"
          className={inputClassName}
        />
      </label>
      <label className="block text-xs">
        Message
        <textarea
          value={form.message}
          onChange={(event) => update("message")(event.target.value)}
          rows={4}
          className={inputClassName}
        />
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website")(event.target.value)}
          name="website"
        />
      </div>

      {status === "failed" && <p className="text-xs text-destructive">{failure}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" size="sm" disabled={!ready || status === "sending"}>
          {status === "sending" ? "Sending..." : "Send to Filip"}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
