// Pixel-art avatar drawn on a 32x32 grid. Every character in a sprite row is one pixel,
// "." is transparent and any other character is a key in PALETTE.

export const GRID = 32;

export const PALETTE: Record<string, string> = {
  o: "#2b1a12", // outline
  H: "#6b4226", // hair
  h: "#4d2e1a", // hair shadow
  L: "#8c5a34", // hair highlight
  S: "#f3c9a5", // skin
  s: "#dca582", // skin shadow
  N: "#cf9470", // nose
  W: "#fdfdfd", // eye white
  P: "#24160e", // pupils and eyelids
  B: "#4d2e1a", // eyebrows
  G: "#1f2937", // glasses frame
  g: "#dbeafe", // lens glint
  M: "#9b4636", // mouth
  m: "#5e2318", // inside of the mouth
  C: "#efa38f", // blush
  T: "#2563eb", // hoodie
  t: "#1d4ed8", // hoodie shadow
  c: "#f1f5f9", // hoodie strings
  x: "#94a3b8", // motion lines
};

export interface Sprite {
  x: number;
  y: number;
  rows: readonly string[];
}

export interface Run {
  x: number;
  y: number;
  w: number;
  fill: string;
}

// Head, hair and ears. Moves when the avatar turns its head.
const HEAD: Sprite = {
  x: 0,
  y: 0,
  rows: [
    "................................",
    "................................",
    "...........oooooooooo...........",
    ".........ooHHHHLLHHHHoo.........",
    "........oHHHHHHLLLHHHHHo........",
    ".......oHHHHHHHHHLLLHHHHo.......",
    "......ohHHHHHHHHHHHLLHHHho......",
    "......ohHHHHHHHHHHHHHHHHho......",
    "......ohHHHHHHHHhSSSSSSHho......",
    "......ohHhSSSSSSSSSSSSSHho......",
    "......ohSSSSSSSSSSSSSSSSho......",
    "......ohSSSSSSSSSSSSSSSSho......",
    "......ohSSSSSSSSSSSSSSSSho......",
    ".....oSsSSSSSSSSSSSSSSSSsSo.....",
    ".....oSsSSSSSSSSSSSSSSSSsSo.....",
    ".....oSsSSSSSSSSSSSSSSSSsSo.....",
    "......osSSSSSSSSSSSSSSSSso......",
    ".......oSSSSSSSSSSSSSSSSo.......",
    ".......oSSSSSSSSSSSSSSSSo.......",
    "........oSSSSSSSSSSSSSSo........",
    ".........oSSSSSSSSSSSSo.........",
    "..........osSSSSSSSSso..........",
    "...........oooooooooo...........",
  ],
};

// Neck and hoodie. Never moves; the neck reaches up behind the chin so a raised head leaves no gap.
const BODY: Sprite = {
  x: 0,
  y: 20,
  rows: [
    ".............ssssss.............",
    ".............ssssss.............",
    ".............ssssss.............",
    ".............ssssss.............",
    "............oSSSSSSo............",
    ".......oTTTTtSSSSSStTTTTo.......",
    ".....oTTTTTTTtSSSStTTTTTTTo.....",
    "....oTTTTTTTTTtSStTTTTTTTTTo....",
    "...oTTTTTTTTTTTttTTTTTTTTTTTo...",
    "...oTTTTtTTTTcTTTTcTTTTtTTTTo...",
    "...oTTTTtTTTTcTTTTcTTTTtTTTTo...",
    "...oTTTTtTTTTTTTTTTTTTTtTTTTo...",
  ],
};

const GLASSES: Sprite = {
  x: 8,
  y: 11,
  rows: [
    ".GGGGGG..GGGGGG.",
    "GG...gGGGG...gGG",
    ".G....G..G....G.",
    ".G....G..G....G.",
    ".G....G..G....G.",
    ".GGGGGG..GGGGGG.",
  ],
};

export type Eyes = "open" | "squint" | "closed" | "happy";
export type Brows = "neutral" | "angry";
export type Mouth = "neutral" | "smirk" | "smile" | "frown" | "open" | "o";

const EYES: Record<Eyes, Sprite> = {
  open: { x: 10, y: 13, rows: ["WWWW....WWWW", "WWWW....WWWW", "WWWW....WWWW"] },
  squint: { x: 10, y: 13, rows: ["PPPP....PPPP", "WWWW....WWWW", "WWWW....WWWW"] },
  closed: { x: 10, y: 13, rows: ["............", "PPPP....PPPP", "............"] },
  happy: { x: 10, y: 13, rows: [".PP......PP.", "P..P....P..P", "............"] },
};

const BROWS: Record<Brows, Sprite> = {
  neutral: { x: 10, y: 9, rows: ["BBBB....BBBB"] },
  angry: { x: 10, y: 9, rows: ["BB........BB", "..BB....BB.."] },
};

const NOSE: Sprite = { x: 15, y: 17, rows: [".N", "NN"] };

const MOUTHS: Record<Mouth, Sprite> = {
  neutral: { x: 13, y: 19, rows: ["......", ".MMMM."] },
  smirk: { x: 13, y: 19, rows: [".....M", ".MMMM."] },
  smile: { x: 13, y: 19, rows: ["M....M", ".MMMM."] },
  frown: { x: 13, y: 19, rows: [".MMMM.", "M....M"] },
  open: { x: 13, y: 19, rows: [".MMMM.", ".MmmM."] },
  o: { x: 13, y: 19, rows: ["..MM..", "..MM.."] },
};

const BLUSH: Sprite = { x: 10, y: 17, rows: ["CC........CC"] };

// Hand raised on the right to shoo the cursor away. The two frames pivot at the wrist.
const SLEEVE = [
  "..oTTTTo....",
  "..oTTTTo....",
  "..oTTTTo....",
  "..otTTto....",
  "..oTTTTo....",
  "..oTTTTo....",
  "..oTTTTo....",
  "..oTTTTo....",
];

const HAND_FRAMES: readonly Sprite[] = [
  {
    x: 20,
    y: 10,
    rows: [
      "..o.o.o.o.x.",
      ".oSoSoSoSo.x",
      ".oSoSoSoSo.x",
      ".oSoSoSoSox.",
      "ooSSSSSSSo..",
      "oSoSSSSSSo..",
      "oSSSSSSSSo..",
      ".oSSSSSSo...",
      "..oSSSSo....",
      ...SLEEVE,
    ],
  },
  {
    x: 20,
    y: 10,
    rows: [
      ".x.o.o.o.o..",
      "x.oSoSoSoSo.",
      "x.oSoSoSoSo.",
      ".xoSoSoSoSo.",
      ".ooSSSSSSSo.",
      ".oSoSSSSSSo.",
      ".oSSSSSSSSo.",
      "..oSSSSSSo..",
      "..oSSSSo....",
      ...SLEEVE,
    ],
  },
];

export interface Offset {
  x: number;
  y: number;
}

export interface AvatarPose {
  head: Offset;
  /** Extra shift of the face on top of the head, which gives the turn some depth. */
  face: Offset;
  /** Pupil offset inside the eye: x from -1 to 1, y from -1 to 0. */
  pupil: Offset;
  eyes: Eyes;
  brows: Brows;
  mouth: Mouth;
  blush: boolean;
  /** Which side the shoo hand is on, and which frame of the wave to draw. */
  hand: { side: "left" | "right"; frame: number } | null;
}

export const NEUTRAL_POSE: AvatarPose = {
  head: { x: 0, y: 0 },
  face: { x: 0, y: 0 },
  pupil: { x: 0, y: 0 },
  eyes: "open",
  brows: "neutral",
  mouth: "smirk",
  blush: false,
  hand: null,
};

const HAIR_CHARS = new Set(["o", "H", "h", "L"]);

// Hair below the forehead is drawn again over the face, so glasses and brows tuck under it.
const HAIR_FRONT: Sprite = {
  x: 0,
  y: 8,
  rows: HEAD.rows
    .slice(8)
    .map((row) => [...row].map((char) => (HAIR_CHARS.has(char) ? char : ".")).join("")),
};

function mirror(sprite: Sprite): Sprite {
  const width = Math.max(...sprite.rows.map((row) => row.length));
  return {
    x: GRID - sprite.x - width,
    y: sprite.y,
    rows: sprite.rows.map((row) => [...row.padEnd(width, ".")].reverse().join("")),
  };
}

/** Turns a sprite into horizontal runs of one color, shifted by the given offset. */
export function toRuns(sprite: Sprite, offset: Offset = { x: 0, y: 0 }): Run[] {
  const runs: Run[] = [];
  sprite.rows.forEach((row, rowIndex) => {
    let start = 0;
    while (start < row.length) {
      const char = row[start];
      let end = start + 1;
      while (end < row.length && row[end] === char) end++;
      if (char !== ".") {
        const fill = PALETTE[char];
        if (!fill) throw new Error(`Unknown sprite color "${char}"`);
        runs.push({
          x: sprite.x + start + offset.x,
          y: sprite.y + rowIndex + offset.y,
          w: end - start,
          fill,
        });
      }
      start = end;
    }
  });
  return runs;
}

function pupils(pose: AvatarPose, faceOffset: Offset): Run[] {
  if (pose.eyes === "closed" || pose.eyes === "happy") return [];
  const y = 14 + (pose.eyes === "squint" ? 0 : pose.pupil.y);
  return [11, 19]
    .map((eyeX) => ({
      x: eyeX + pose.pupil.x + faceOffset.x,
      y: y + faceOffset.y,
      w: 2,
      fill: PALETTE.P,
    }))
    .flatMap((run) => [run, { ...run, y: run.y + 1 }]);
}

/** All pixels of the avatar for one pose, in drawing order. */
export function composeAvatar(pose: AvatarPose): Run[] {
  const faceOffset = { x: pose.head.x + pose.face.x, y: pose.head.y + pose.face.y };
  const runs = [...toRuns(BODY), ...toRuns(HEAD, pose.head)];
  if (pose.blush) runs.push(...toRuns(BLUSH, faceOffset));
  runs.push(
    ...toRuns(EYES[pose.eyes], faceOffset),
    ...pupils(pose, faceOffset),
    ...toRuns(BROWS[pose.brows], faceOffset),
    ...toRuns(NOSE, faceOffset),
    ...toRuns(MOUTHS[pose.mouth], faceOffset),
    ...toRuns(GLASSES, faceOffset),
    ...toRuns(HAIR_FRONT, pose.head)
  );
  if (pose.hand) {
    const frame = HAND_FRAMES[pose.hand.frame % HAND_FRAMES.length];
    runs.push(...toRuns(pose.hand.side === "right" ? frame : mirror(frame)));
  }
  return runs;
}

export const SPRITES_FOR_TESTS = {
  HEAD,
  BODY,
  GLASSES,
  EYES,
  BROWS,
  NOSE,
  MOUTHS,
  BLUSH,
  HAND_FRAMES,
};
