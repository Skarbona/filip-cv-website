"use client";

import { useState } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PixelIcon } from "@/components/PixelIcon";
import { locateCity } from "@/lib/chat/geo";
import { inputClassName } from "./inputClassName";

interface InvoiceCardProps {
  onContinue: (invoiceTo: string) => void;
  onDismiss: () => void;
}

export default function InvoiceCard({ onContinue, onDismiss }: InvoiceCardProps) {
  const [invoiceTo, setInvoiceTo] = useState("");
  const [status, setStatus] = useState<"idle" | "locating" | "failed">("idle");

  const fillFromLocation = async () => {
    setStatus("locating");
    try {
      const place = await locateCity();
      setInvoiceTo([place.city, place.country].filter(Boolean).join(", "));
      setStatus("idle");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <Button
        type="button"
        size="sm"
        onClick={fillFromLocation}
        disabled={status === "locating"}
        className="gap-2"
      >
        <PixelIcon name="location-pin-solid" width={14} height={14} />
        {status === "locating" ? "Locating..." : "Use my location"}
      </Button>

      <label className="block text-xs">
        Invoice to
        <input
          value={invoiceTo}
          onChange={(event) => setInvoiceTo(event.target.value)}
          placeholder="Company name, city"
          className={inputClassName}
        />
      </label>

      {status === "failed" && (
        <p className="text-xs text-destructive">
          Couldn&apos;t get your location. Type it in instead.
        </p>
      )}
      <p className="text-[11px] text-muted-foreground">
        Your browser asks first. Only the city is used (looked up via BigDataCloud) and nothing is
        stored unless you send the request.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => onContinue(invoiceTo.trim())}
          disabled={!invoiceTo.trim()}
        >
          Continue
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onDismiss}>
          No thanks
        </Button>
      </div>
    </div>
  );
}
