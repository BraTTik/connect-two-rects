import { ConnectionPoint, Point, Rect } from "models";
import {
  angle,
  direction,
  isPointOnLine,
  toRadians,
  getIntersection,
} from "../math";

type Edge = [Point, Point];

type EdgeType = "top" | "bottom" | "left" | "right";

export const EdgeTypeAngle = {
  top: -Math.PI / 2,
  bottom: Math.PI / 2,
  left: -Math.PI,
  right: 0,
};

export const getRectBounds = (rect: Rect) => {
  const { size, position } = rect;

  const { x, y } = position;
  const wOffset = size.width / 2;
  const hOffset = size.height / 2;

  return {
    top: y - hOffset,
    left: x - wOffset,
    right: x + wOffset,
    bottom: y + hOffset,
  };
};

export const getRectEdges = (rect: Rect) => {
  const bounds = getRectBounds(rect);

  const topLeft: Point = { x: bounds.left, y: bounds.top };
  const topRight: Point = { x: bounds.right, y: bounds.top };
  const bottomLeft: Point = { x: bounds.left, y: bounds.bottom };
  const bottomRight: Point = { x: bounds.right, y: bounds.bottom };

  const top: Edge = [topLeft, topRight];
  const bottom: Edge = [bottomLeft, bottomRight];
  const left: Edge = [topLeft, bottomLeft];
  const right: Edge = [topRight, bottomRight];

  return { top, bottom, left, right };
};

export const isConnectionAngleRight = (
  type: EdgeType,
  degree: number,
): boolean => {
  const radians = toRadians(degree);
  return EdgeTypeAngle[type] === radians;
};

export const isLineIntersectRect = (line: Point[], rect: Rect) => {
  if (line.length < 2) return false;
  const edges = Object.values(getRectEdges(rect));
  let hasIntersection = false;

  for (let i = 1; i < line.length; i++) {
    if (hasIntersection) break;
    const segment: [Point, Point] = [line[i - 1], line[i]];
    for (const edge of edges) {
      if (hasIntersection) break;
      hasIntersection = Boolean(getIntersection(edge, segment));
    }
  }

  return hasIntersection;
};

export const isRectangleIntersect = (rect1: Rect, rect2: Rect): boolean => {
  const rect1Edges = Object.values(getRectEdges(rect1));

  let hasIntersection = false;

  for (const edge1 of rect1Edges) {
    if (hasIntersection) break;
    hasIntersection = isLineIntersectRect(edge1, rect2);
  }

  return hasIntersection;
};

export const getConnectionPointEdge = (
  cPoint: ConnectionPoint,
  rect: Rect,
): Edge | null => {
  const { point, angle } = cPoint;
  const { top, left, right, bottom } = getRectEdges(rect);

  let edge: Edge | null = null;

  if (isPointOnLine(point, top) && isConnectionAngleRight("top", angle)) {
    edge = top;
  } else if (
    isPointOnLine(point, left) &&
    isConnectionAngleRight("left", angle)
  ) {
    edge = left;
  } else if (
    isPointOnLine(point, right) &&
    isConnectionAngleRight("right", angle)
  ) {
    edge = right;
  } else if (
    isPointOnLine(point, bottom) &&
    isConnectionAngleRight("bottom", angle)
  ) {
    edge = bottom;
  }

  return edge;
};

export const isPointsEqual = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
