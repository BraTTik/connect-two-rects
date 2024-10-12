import { IntersectionPoint, Point } from "models";

export const minmax = (min: number, max: number) => (pivot: number) =>
  Math.max(Math.min(max, pivot), min);

export function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function angle(p: Point): number {
  return Math.atan2(p.y, p.x);
}

export function scale(p: Point, scaler: number): Point {
  return { x: p.x * scaler, y: p.y * scaler };
}

export function magnitude(p: Point) {
  return Math.hypot(p.x, p.y);
}

export function normalize(p: Point): Point {
  return scale(p, 1 / magnitude(p));
}

export function direction(a: Point, b: Point) {
  return normalize(subtract(b, a));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpPoint(a: Point, b: Point, t: number): Point {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

export function isPointOnLine(p: Point, line: [Point, Point]): boolean {
  const [a, b] = line;

  const isCollinear =
    (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x) === 0;
  const isBetween = (p.x >= a.x && p.x <= b.x) || (p.x >= b.x && p.x <= a.x);

  return isCollinear && isBetween;
}

export function toXY({
  magnitude,
  direction,
}: {
  magnitude: number;
  direction: number;
}): Point {
  return {
    x: Math.cos(direction) * magnitude,
    y: Math.sin(direction) * magnitude,
  };
}

export function toDegree(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function toRadians(degree: number): number {
  return (degree * Math.PI) / 180;
}

export function getIntersection(
  line1: [Point, Point],
  line2: [Point, Point],
): IntersectionPoint | null {
  const [a, b] = line1;
  const [c, d] = line2;

  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        offset: t,
      };
    }
  }

  return null;
}
