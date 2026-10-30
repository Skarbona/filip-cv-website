import {
  CENTER_LOOK,
  ShooDetector,
  buildPose,
  contains,
  faceRect,
  lookTarget,
  quantizeLook,
  sameLook,
  type Point,
  type PoseInput,
} from "../behavior";

const box = { left: 100, top: 100, width: 256, height: 256 };
const eyes = { x: 100 + 128, y: 100 + 256 * (14 / 32) };

/** Pointer samples every 16 ms, going back and forth between 0 and `span` px. */
function zigzag(count: number, stepPx: number, span: number): Point[] {
  const points: Point[] = [];
  let x = 0;
  let direction = 1;
  for (let i = 0; i < count; i++) {
    points.push({ x, y: 50 });
    x += direction * stepPx;
    if (x >= span || x <= 0) direction = -direction;
  }
  return points;
}

function feed(points: Point[], inFace: boolean, faceWidth = 140) {
  const detector = new ShooDetector();
  return points.some((point, index) => detector.add(index * 16, point, inFace, faceWidth));
}

describe("lookTarget", () => {
  it("is centered when the pointer is at the eyes", () => {
    expect(lookTarget(eyes, box)).toEqual({ x: 0, y: 0 });
  });

  it("points toward the cursor and stays within -1..1", () => {
    expect(lookTarget({ x: 5000, y: eyes.y }, box)).toEqual({ x: 1, y: 0 });
    expect(lookTarget({ x: eyes.x, y: -5000 }, box)).toEqual({ x: 0, y: -1 });
  });
});

describe("quantizeLook", () => {
  it("moves the pupils before the head", () => {
    const look = quantizeLook({ x: 0.2, y: -0.3 }, { x: 0.1, y: 0 });
    expect(look.pupil).toEqual({ x: 1, y: -1 });
    expect(look.head).toEqual({ x: 0, y: 0 });
  });

  it("turns the face further than the head when the cursor is far to the side", () => {
    const look = quantizeLook({ x: -1, y: 0 }, { x: -0.8, y: 0 });
    expect(look.head.x).toBe(-1);
    expect(look.face.x).toBe(-1);
  });

  it("compares looks by value", () => {
    expect(sameLook(CENTER_LOOK, quantizeLook({ x: 0, y: 0 }, { x: 0, y: 0 }))).toBe(true);
    expect(sameLook(CENTER_LOOK, quantizeLook({ x: 1, y: 0 }, { x: 0, y: 0 }))).toBe(false);
  });
});

describe("faceRect", () => {
  it("covers the middle of the avatar but not the corners", () => {
    const face = faceRect(box);
    expect(contains(face, eyes)).toBe(true);
    expect(contains(face, { x: box.left + 2, y: box.top + 2 })).toBe(false);
  });
});

describe("ShooDetector", () => {
  it("fires when the cursor flies back and forth over the face", () => {
    expect(feed(zigzag(40, 30, 140), true)).toBe(true);
  });

  it("ignores slow movement over the face", () => {
    expect(feed(zigzag(40, 3, 140), true)).toBe(false);
  });

  it("ignores one fast pass across the face", () => {
    const pass = Array.from({ length: 40 }, (_, index) => ({ x: index * 30, y: 50 }));
    expect(feed(pass, true)).toBe(false);
  });

  it("ignores wiggling away from the face", () => {
    expect(feed(zigzag(40, 30, 140), false)).toBe(false);
  });

  it("forgets samples after reset", () => {
    const detector = new ShooDetector();
    zigzag(40, 30, 140).forEach((point, index) => detector.add(index * 16, point, true, 140));
    detector.reset();
    expect(detector.add(700, { x: 0, y: 0 }, true, 140)).toBe(false);
  });
});

describe("buildPose", () => {
  const base: PoseInput = {
    look: CENTER_LOOK,
    blinking: false,
    mood: "idle",
    mouthOpen: false,
    greeting: false,
    shoo: null,
  };

  it("smirks and keeps the eyes open when idle", () => {
    expect(buildPose(base)).toMatchObject({ eyes: "open", mouth: "smirk", hand: null });
  });

  it("closes the eyes while blinking", () => {
    expect(buildPose({ ...base, blinking: true }).eyes).toBe("closed");
  });

  it("alternates the mouth while talking", () => {
    expect(buildPose({ ...base, mood: "talking", mouthOpen: true }).mouth).toBe("open");
    expect(buildPose({ ...base, mood: "talking", mouthOpen: false }).mouth).toBe("neutral");
  });

  it("smiles with happy eyes while greeting", () => {
    expect(buildPose({ ...base, greeting: true })).toMatchObject({
      eyes: "happy",
      mouth: "smile",
      blush: true,
    });
  });

  it("leans away and waves while shooing, even mid-greeting", () => {
    const pose = buildPose({ ...base, greeting: true, shoo: { side: "right", frame: 3 } });
    expect(pose).toMatchObject({
      brows: "angry",
      eyes: "squint",
      hand: { side: "right", frame: 3 },
    });
    expect(pose.head.x).toBe(-1);
    expect(pose.pupil.x).toBe(1);
  });
});
