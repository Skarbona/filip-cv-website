import { GRID, type AvatarPose, type Offset } from "./sprites";

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Look {
  head: Offset;
  face: Offset;
  pupil: Offset;
}

export const CENTER_LOOK: Look = {
  head: { x: 0, y: 0 },
  face: { x: 0, y: 0 },
  pupil: { x: 0, y: 0 },
};

const EYE_LINE = 14 / GRID;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function step(value: number, threshold: number) {
  if (value > threshold) return 1;
  if (value < -threshold) return -1;
  return 0;
}

/** Where the pointer is relative to the avatar's eyes, from -1 to 1 on each axis. */
export function lookTarget(pointer: Point, box: Box): Point {
  const reach = Math.max(box.width * 1.5, 240);
  return {
    x: clamp((pointer.x - (box.left + box.width / 2)) / reach, -1, 1),
    y: clamp((pointer.y - (box.top + box.height * EYE_LINE)) / reach, -1, 1),
  };
}

/** Eyes follow the raw target and the head a smoothed one, so the eyes lead and the head catches up. */
export function quantizeLook(eyes: Point, head: Point): Look {
  return {
    pupil: { x: step(eyes.x, 0.12), y: eyes.y < -0.2 ? -1 : 0 },
    head: { x: step(head.x, 0.3), y: step(head.y, 0.45) },
    face: { x: step(head.x, 0.65), y: 0 },
  };
}

export function sameLook(a: Look, b: Look) {
  return (["head", "face", "pupil"] as const).every(
    (part) => a[part].x === b[part].x && a[part].y === b[part].y
  );
}

// Face area of the sprite in grid units: hair, ears and chin.
const FACE = { x: 5, y: 2, width: 22, height: 21 };

export function faceRect(box: Box): Box {
  const unit = box.width / GRID;
  return {
    left: box.left + FACE.x * unit,
    top: box.top + FACE.y * unit,
    width: FACE.width * unit,
    height: FACE.height * unit,
  };
}

export function contains(box: Box, point: Point) {
  return (
    point.x >= box.left &&
    point.x <= box.left + box.width &&
    point.y >= box.top &&
    point.y <= box.top + box.height
  );
}

export interface ShooOptions {
  windowMs: number;
  /** Path the cursor must travel over the face, in face widths. */
  minPath: number;
  /** Direction changes needed, so a single fast pass doesn't count. */
  minReversals: number;
  /** Average speed over the face, in px per ms. */
  minSpeed: number;
}

const DEFAULT_SHOO: ShooOptions = { windowMs: 800, minPath: 2, minReversals: 2, minSpeed: 0.6 };

interface Sample extends Point {
  t: number;
  inFace: boolean;
}

/** Detects a cursor that keeps flying back and forth in front of the face. */
export class ShooDetector {
  private samples: Sample[] = [];
  private readonly options: ShooOptions;

  constructor(options: ShooOptions = DEFAULT_SHOO) {
    this.options = options;
  }

  add(t: number, point: Point, inFace: boolean, faceWidth: number): boolean {
    this.samples.push({ t, x: point.x, y: point.y, inFace });
    this.samples = this.samples.filter((sample) => t - sample.t <= this.options.windowMs);

    let path = 0;
    let reversals = 0;
    let start = Infinity;
    let end = -Infinity;
    const lastSign = { x: 0, y: 0 };

    for (let i = 1; i < this.samples.length; i++) {
      const from = this.samples[i - 1];
      const to = this.samples[i];
      if (!from.inFace && !to.inFace) continue;

      const delta = { x: to.x - from.x, y: to.y - from.y };
      path += Math.hypot(delta.x, delta.y);
      start = Math.min(start, from.t);
      end = Math.max(end, to.t);

      for (const axis of ["x", "y"] as const) {
        if (Math.abs(delta[axis]) < 3) continue;
        const sign = Math.sign(delta[axis]);
        if (lastSign[axis] && sign !== lastSign[axis]) reversals++;
        lastSign[axis] = sign;
      }
    }

    const speed = path / Math.max(end - start, 1);
    return (
      path >= this.options.minPath * faceWidth &&
      reversals >= this.options.minReversals &&
      speed >= this.options.minSpeed
    );
  }

  reset() {
    this.samples = [];
  }
}

export type Mood = "idle" | "talking";

export interface Shoo {
  side: "left" | "right";
  frame: number;
}

export interface PoseInput {
  look: Look;
  blinking: boolean;
  mood: Mood;
  mouthOpen: boolean;
  greeting: boolean;
  shoo: Shoo | null;
}

/** Picks the face for the current moment. Shooing wins over greeting, greeting over talking. */
export function buildPose({
  look,
  blinking,
  mood,
  mouthOpen,
  greeting,
  shoo,
}: PoseInput): AvatarPose {
  if (shoo) {
    const away = shoo.side === "right" ? -1 : 1;
    return {
      head: { x: away, y: 0 },
      face: { x: away, y: 0 },
      pupil: { x: -away, y: 0 },
      eyes: blinking ? "closed" : "squint",
      brows: "angry",
      mouth: shoo.frame % 2 ? "open" : "frown",
      blush: false,
      hand: { side: shoo.side, frame: shoo.frame },
    };
  }

  if (greeting) {
    return { ...look, eyes: "happy", brows: "neutral", mouth: "smile", blush: true, hand: null };
  }

  return {
    ...look,
    eyes: blinking ? "closed" : "open",
    brows: "neutral",
    mouth: mood === "talking" ? (mouthOpen ? "open" : "neutral") : "smirk",
    blush: false,
    hand: null,
  };
}
