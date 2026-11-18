export interface Point2D {
  x: number;
  y: number;
}

export interface CubicSegment {
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
}

function evalCubic(seg: CubicSegment, tRaw: number): Point2D {
  const t = Math.max(0, Math.min(1, tRaw));
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * seg.p0.x + 3 * uu * t * seg.p1.x + 3 * u * tt * seg.p2.x + ttt * seg.p3.x,
    y: uuu * seg.p0.y + 3 * uu * t * seg.p1.y + 3 * u * tt * seg.p2.y + ttt * seg.p3.y,
  };
}

function reverseSegment(seg: CubicSegment): CubicSegment {
  return { p0: seg.p3, p1: seg.p2, p2: seg.p1, p3: seg.p0 };
}

export function segmentToSvgPath(seg: CubicSegment): string {
  return `M ${seg.p0.x},${seg.p0.y} C ${seg.p1.x},${seg.p1.y} ${seg.p2.x},${seg.p2.y} ${seg.p3.x},${seg.p3.y}`;
}

// Control Room map coordinate space: viewBox="0 0 1000 500"
export const CONTROL_ROOM_ANCHORS: Record<string, Point2D> = {
  "cp-a": { x: 185, y: 175 },
  "cp-b": { x: 475, y: 315 },
  "cp-c": { x: 795, y: 175 },
};

export const CONTROL_ROOM_SEGMENTS = {
  ab: {
    p0: CONTROL_ROOM_ANCHORS["cp-a"],
    p1: { x: 265, y: 225 },
    p2: { x: 365, y: 300 },
    p3: CONTROL_ROOM_ANCHORS["cp-b"],
  } satisfies CubicSegment,
  bc: {
    p0: CONTROL_ROOM_ANCHORS["cp-b"],
    p1: { x: 595, y: 305 },
    p2: { x: 695, y: 240 },
    p3: CONTROL_ROOM_ANCHORS["cp-c"],
  } satisfies CubicSegment,
  ca: {
    p0: CONTROL_ROOM_ANCHORS["cp-c"],
    p1: { x: 760, y: 425 },
    p2: { x: 240, y: 430 },
    p3: CONTROL_ROOM_ANCHORS["cp-a"],
  } satisfies CubicSegment,
};

export function getControlRoomPercent(
  fromId: string,
  toId: string,
  progress: number
): { xPercent: number; yPercent: number } {
  const t = progress / 100;
  let pt: Point2D;

  if (fromId === "cp-a" && toId === "cp-b") {
    pt = evalCubic(CONTROL_ROOM_SEGMENTS.ab, t);
  } else if (fromId === "cp-b" && toId === "cp-a") {
    pt = evalCubic(reverseSegment(CONTROL_ROOM_SEGMENTS.ab), t);
  } else if (fromId === "cp-b" && toId === "cp-c") {
    pt = evalCubic(CONTROL_ROOM_SEGMENTS.bc, t);
  } else if (fromId === "cp-c" && toId === "cp-b") {
    pt = evalCubic(reverseSegment(CONTROL_ROOM_SEGMENTS.bc), t);
  } else if (fromId === "cp-c" && toId === "cp-a") {
    pt = evalCubic(CONTROL_ROOM_SEGMENTS.ca, t);
  } else if (fromId === "cp-a" && toId === "cp-c") {
    pt = evalCubic(reverseSegment(CONTROL_ROOM_SEGMENTS.ca), t);
  } else {
    pt = CONTROL_ROOM_ANCHORS[fromId] || CONTROL_ROOM_ANCHORS["cp-a"];
  }

  return {
    xPercent: Number(((pt.x / 1000) * 100).toFixed(2)),
    yPercent: Number(((pt.y / 500) * 100).toFixed(2)),
  };
}

// Landing Hero stage coordinate space: viewBox="0 0 680 400"
export const HERO_ANCHORS: Record<string, Point2D> = {
  "cp-a": { x: 145, y: 138 },
  "cp-b": { x: 295, y: 238 },
  "cp-c": { x: 505, y: 122 },
};

export const HERO_SEGMENTS = {
  ab: {
    p0: HERO_ANCHORS["cp-a"],
    p1: { x: 180, y: 190 },
    p2: { x: 225, y: 225 },
    p3: HERO_ANCHORS["cp-b"],
  } satisfies CubicSegment,
  bc: {
    p0: HERO_ANCHORS["cp-b"],
    p1: { x: 385, y: 235 },
    p2: { x: 440, y: 165 },
    p3: HERO_ANCHORS["cp-c"],
  } satisfies CubicSegment,
  ca: {
    p0: HERO_ANCHORS["cp-c"],
    p1: { x: 515, y: 340 },
    p2: { x: 175, y: 355 },
    p3: HERO_ANCHORS["cp-a"],
  } satisfies CubicSegment,
};

export function getHeroPercent(
  fromId: string,
  toId: string,
  progress: number
): { xPercent: number; yPercent: number } {
  const t = progress / 100;
  let pt: Point2D;

  if (fromId === "cp-a" && toId === "cp-b") {
    pt = evalCubic(HERO_SEGMENTS.ab, t);
  } else if (fromId === "cp-b" && toId === "cp-a") {
    pt = evalCubic(reverseSegment(HERO_SEGMENTS.ab), t);
  } else if (fromId === "cp-b" && toId === "cp-c") {
    pt = evalCubic(HERO_SEGMENTS.bc, t);
  } else if (fromId === "cp-c" && toId === "cp-b") {
    pt = evalCubic(reverseSegment(HERO_SEGMENTS.bc), t);
  } else if (fromId === "cp-c" && toId === "cp-a") {
    pt = evalCubic(HERO_SEGMENTS.ca, t);
  } else if (fromId === "cp-a" && toId === "cp-c") {
    pt = evalCubic(reverseSegment(HERO_SEGMENTS.ca), t);
  } else {
    pt = HERO_ANCHORS[fromId] || HERO_ANCHORS["cp-a"];
  }

  return {
    xPercent: Number(((pt.x / 680) * 100).toFixed(2)),
    yPercent: Number(((pt.y / 400) * 100).toFixed(2)),
  };
}
