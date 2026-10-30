"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PixelIcon } from "@/components/PixelIcon";
import PixelAvatar from "./avatar/PixelAvatar";

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  /** Makes the avatar talk while an answer is on its way. */
  thinking: boolean;
  children: ReactNode;
}

export default function ChatModal({ open, onClose, thinking, children }: ChatModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // On phones the keyboard would cover the avatar, so only focus the input on wide screens
      if (window.matchMedia?.("(min-width: 768px)").matches) {
        dialog.querySelector("textarea")?.focus();
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="chat-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/60 md:m-auto md:h-[min(52rem,calc(100dvh-3rem))] md:w-[min(44rem,calc(100vw-3rem))] md:shadow-(--pixel-box-shadow)"
    >
      {open && (
        <div className="animate-in fade-in-0 zoom-in-95 flex h-full flex-col bg-card text-card-foreground duration-200 motion-reduce:animate-none">
          <header className="flex items-start justify-between gap-4 border-b-4 border-black px-4 py-3 dark:border-ring">
            <div>
              <h2 id="chat-title" className="pixel-font text-xs leading-relaxed sm:text-sm">
                Chat with Filip
              </h2>
              <p className="text-xs text-muted-foreground">
                My AI twin. Ask about my work, travels and life.
              </p>
            </div>
            <Button
              size="sm"
              className="w-9 shrink-0 p-0"
              aria-label="Close chat"
              onClick={onClose}
            >
              <PixelIcon name="times-solid" width={20} height={20} />
            </Button>
          </header>

          <div className="flex justify-center bg-gradient-to-b from-sky-100 to-blue-50 px-4 pt-8 pb-4 dark:from-slate-800 dark:to-slate-900">
            <PixelAvatar
              className="aspect-square h-[clamp(6rem,28dvh,16rem)]"
              mood={thinking ? "talking" : "idle"}
              greet
              label="Pixel-art Filip"
            />
          </div>

          {children}
        </div>
      )}
    </dialog>
  );
}
