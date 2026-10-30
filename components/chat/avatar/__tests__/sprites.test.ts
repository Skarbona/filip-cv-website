import {
  GRID,
  NEUTRAL_POSE,
  PALETTE,
  SPRITES_FOR_TESTS,
  composeAvatar,
  toRuns,
  type AvatarPose,
  type Sprite,
} from "../sprites";

const { HEAD, BODY, GLASSES, NOSE, BLUSH, EYES, BROWS, MOUTHS, HAND_FRAMES } = SPRITES_FOR_TESTS;

const sprites: [string, Sprite][] = [
  ["HEAD", HEAD],
  ["BODY", BODY],
  ["GLASSES", GLASSES],
  ["NOSE", NOSE],
  ["BLUSH", BLUSH],
  ...Object.entries(EYES).map(([name, sprite]): [string, Sprite] => [`eyes ${name}`, sprite]),
  ...Object.entries(BROWS).map(([name, sprite]): [string, Sprite] => [`brows ${name}`, sprite]),
  ...Object.entries(MOUTHS).map(([name, sprite]): [string, Sprite] => [`mouth ${name}`, sprite]),
  ...HAND_FRAMES.map((sprite, index): [string, Sprite] => [`hand frame ${index}`, sprite]),
];

const pupilRuns = (pose: AvatarPose) =>
  composeAvatar(pose).filter((run) => run.fill === PALETTE.P && run.w === 2).length;

describe("avatar sprites", () => {
  it.each(sprites)("%s has rows of one width that fit the grid", (_name, sprite) => {
    const widths = new Set(sprite.rows.map((row) => row.length));
    expect(widths.size).toBe(1);
    expect(sprite.x + [...widths][0]).toBeLessThanOrEqual(GRID);
    expect(sprite.y + sprite.rows.length).toBeLessThanOrEqual(GRID);
  });

  it("merges neighbouring pixels of one color into a run", () => {
    expect(toRuns({ x: 1, y: 2, rows: ["SS.G"] })).toEqual([
      { x: 1, y: 2, w: 2, fill: PALETTE.S },
      { x: 4, y: 2, w: 1, fill: PALETTE.G },
    ]);
  });

  it("rejects colors that are not in the palette", () => {
    expect(() => toRuns({ x: 0, y: 0, rows: ["?"] })).toThrow('Unknown sprite color "?"');
  });

  const extremePoses: AvatarPose[] = [
    ...[-1, 1].flatMap((x) =>
      [-1, 1].map((y) => ({
        ...NEUTRAL_POSE,
        head: { x, y },
        face: { x, y: 0 },
        pupil: { x, y: Math.min(y, 0) },
      }))
    ),
    { ...NEUTRAL_POSE, hand: { side: "left", frame: 1 } },
    { ...NEUTRAL_POSE, hand: { side: "right", frame: 2 } },
  ];

  it.each(extremePoses)("keeps every pixel on the grid (pose %#)", (pose) => {
    for (const run of composeAvatar(pose)) {
      expect(run.x).toBeGreaterThanOrEqual(0);
      expect(run.x + run.w).toBeLessThanOrEqual(GRID);
      expect(run.y).toBeGreaterThanOrEqual(0);
      expect(run.y).toBeLessThan(GRID);
    }
  });

  it("draws pupils only while the eyes are open", () => {
    expect(pupilRuns(NEUTRAL_POSE)).toBe(4);
    expect(pupilRuns({ ...NEUTRAL_POSE, eyes: "closed" })).toBe(0);
  });

  it("mirrors the hand to the other side of the face", () => {
    const right = composeAvatar({ ...NEUTRAL_POSE, hand: { side: "right", frame: 0 } });
    const left = composeAvatar({ ...NEUTRAL_POSE, hand: { side: "left", frame: 0 } });
    const handStart = (runs: typeof right) => Math.min(...runs.slice(-30).map((run) => run.x));
    expect(handStart(right)).toBeGreaterThan(GRID / 2);
    expect(handStart(left)).toBeLessThan(GRID / 2);
  });
});
