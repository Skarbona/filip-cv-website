"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { GRID, composeAvatar } from "./sprites";
import {
  CENTER_LOOK,
  ShooDetector,
  buildPose,
  contains,
  faceRect,
  lookTarget,
  quantizeLook,
  sameLook,
  type Look,
  type Mood,
  type Point,
  type Shoo,
} from "./behavior";

const SHOO_LINES = [
  "Shoo! Shoo!",
  "Hey, personal space!",
  "Not the face!",
  "I'm trying to work here!",
  "Okay, now you're doing it on purpose.",
];

const SHOO_MS = 1400;
const SHOO_COOLDOWN_MS = 1800;
const WAVE_MS = 120;
const GREETING_MS = 1300;
const TALK_MS = 140;
const BLINK_MS = 140;
const IDLE_AFTER_MS = 4000;
const HEAD_EASING = 0.12;

interface PixelAvatarProps {
  className?: string;
  /** "head" crops the sprite to the face, which reads better at small sizes. */
  crop?: "full" | "head";
  mood?: Mood;
  /** Wave the cursor away when it keeps flying around the face. */
  shoo?: boolean;
  /** Smile for a moment after appearing. */
  greet?: boolean;
  /** Accessible name. Without it the avatar is treated as decoration. */
  label?: string;
}

export default function PixelAvatar({
  className,
  crop = "full",
  mood = "idle",
  shoo: canShoo = true,
  greet = false,
  label,
}: PixelAvatarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [look, setLook] = useState<Look>(CENTER_LOOK);
  const [blinking, setBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [greeting, setGreeting] = useState(greet);
  const [shoo, setShoo] = useState<(Shoo & { line: string }) | null>(null);

  useEffect(() => {
    if (!greeting) return;
    const timer = window.setTimeout(() => setGreeting(false), GREETING_MS);
    return () => window.clearTimeout(timer);
  }, [greeting]);

  useEffect(() => {
    let timer = 0;
    const scheduleBlink = (delay: number) => {
      timer = window.setTimeout(() => {
        setBlinking(true);
        timer = window.setTimeout(() => {
          setBlinking(false);
          // Now and then the blinks come in pairs
          scheduleBlink(Math.random() < 0.2 ? 220 : 2200 + Math.random() * 3800);
        }, BLINK_MS);
      }, delay);
    };
    scheduleBlink(1500 + Math.random() * 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mood !== "talking" || reducedMotion) return;
    const timer = window.setInterval(() => setMouthOpen((open) => !open), TALK_MS);
    return () => window.clearInterval(timer);
  }, [mood, reducedMotion]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reducedMotion) return;

    const detector = new ShooDetector();
    const head: Point = { x: 0, y: 0 };
    let target: Point = { x: 0, y: 0 };
    let idleTarget: Point = { x: 0, y: 0 };
    let lastMove = -Infinity;
    let nextGlance = 0;
    let frame = 0;
    let cooldownUntil = 0;
    let shooCount = 0;
    let shooTimers: number[] = [];

    const startShoo = (side: Shoo["side"], now: number) => {
      cooldownUntil = now + SHOO_MS + SHOO_COOLDOWN_MS;
      const line = SHOO_LINES[Math.min(shooCount, SHOO_LINES.length - 1)];
      shooCount++;
      setShoo({ side, frame: 0, line });
      const wave = window.setInterval(
        () => setShoo((current) => current && { ...current, frame: current.frame + 1 }),
        WAVE_MS
      );
      const end = window.setTimeout(() => {
        window.clearInterval(wave);
        detector.reset();
        setShoo(null);
      }, SHOO_MS);
      shooTimers = [wave, end];
    };

    const onPointerMove = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      if (!box.width) return;
      const point = { x: event.clientX, y: event.clientY };
      lastMove = event.timeStamp;
      target = lookTarget(point, box);
      if (!canShoo) return;

      const face = faceRect(box);
      const flying = detector.add(event.timeStamp, point, contains(face, point), face.width);
      if (flying && event.timeStamp >= cooldownUntil) {
        startShoo(point.x >= face.left + face.width / 2 ? "right" : "left", event.timeStamp);
      }
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      let goal = target;
      if (now - lastMove > IDLE_AFTER_MS) {
        // No cursor around (or a touch screen): glance somewhere now and then
        if (now >= nextGlance) {
          idleTarget =
            Math.random() < 0.4
              ? { x: 0, y: 0 }
              : { x: Math.random() * 1.6 - 0.8, y: Math.random() * 0.9 - 0.6 };
          nextGlance = now + 1800 + Math.random() * 2600;
        }
        goal = idleTarget;
      }
      head.x += (goal.x - head.x) * HEAD_EASING;
      head.y += (goal.y - head.y) * HEAD_EASING;
      const next = quantizeLook(goal, head);
      setLook((current) => (sameLook(current, next) ? current : next));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
      shooTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [canShoo, reducedMotion]);

  const runs = useMemo(
    () => composeAvatar(buildPose({ look, blinking, mood, mouthOpen, greeting, shoo })),
    [look, blinking, mood, mouthOpen, greeting, shoo]
  );

  return (
    <div className={cn("relative", className)}>
      <svg
        ref={svgRef}
        viewBox={crop === "head" ? "4 1 24 24" : `0 0 ${GRID} ${GRID}`}
        shapeRendering="crispEdges"
        className="block size-full"
        {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      >
        {runs.map((run, index) => (
          <rect key={index} x={run.x} y={run.y} width={run.w} height={1} fill={run.fill} />
        ))}
      </svg>
      {shoo && (
        <span
          aria-hidden="true"
          className="pixel-font animate-pixel-shake absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 text-[10px] whitespace-nowrap text-slate-900 shadow-(--pixel-box-shadow)"
        >
          {shoo.line}
        </span>
      )}
    </div>
  );
}
