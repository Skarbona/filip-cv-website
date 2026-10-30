"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import PixelAvatar from "./avatar/PixelAvatar";

const TEASER_MS = 8000;

export default function ChatLauncher({ onOpen }: { onOpen: () => void }) {
  const [teaser, setTeaser] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setTeaser(false), TEASER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // The wrapper does the positioning: .pixel__button sets position: relative outside Tailwind's
  // layers, so a `fixed` class on the button itself loses
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Button
        onClick={onOpen}
        aria-label="Open chat with Filip"
        className="h-auto gap-3 p-1 transition-transform hover:scale-105"
      >
        <PixelAvatar crop="head" shoo={false} className="size-14" />
        {teaser && <span className="animate-fade-in-up pr-3 text-[10px]">Ask me anything!</span>}
      </Button>
    </div>
  );
}
