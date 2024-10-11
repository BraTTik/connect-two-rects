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

const EdgeTypeAngle = {
  top: -Math.PI / 2,
  bottom: Math.PI / 2,
  left: -Math.PI,
  right: 0,
};

export const getRectEdges = (rect: Rect) => {
  const { size, position } = rect;

  const { x, y } = position;
  const wOffset = size.width / 2;
  const hOffset = size.height / 2;

  const topLeft: Point = { x: x - wOffset, y: y - hOffset };
  const topRight: Point = { x: x + wOffset, y: y - hOffset };
  const bottomLeft: Point = { x: x - wOffset, y: y + hOffset };
  const bottomRight: Point = { x: x + wOffset, y: y + hOffset };

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

export const isRectangleIntersect = (rect1: Rect, rect2: Rect): boolean => {
  const rect1Edges = Object.values(getRectEdges(rect1));
  const rect2Edges = Object.values(getRectEdges(rect2));

  let hasIntersection = false;

  for (const edge1 of rect1Edges) {
    if (hasIntersection) break;
    for (const edge2 of rect2Edges) {
      if (hasIntersection) break;
      hasIntersection = Boolean(getIntersection(edge1, edge2));
    }
  }

  return hasIntersection;
};

export const isConnectionPointOnEdge = (
  cPoint: ConnectionPoint,
  rect: Rect,
): boolean => {
  const { point, angle } = cPoint;
  const { top, left, right, bottom } = getRectEdges(rect);

  return (
    (isPointOnLine(point, top) && isConnectionAngleRight("top", angle)) ||
    (isPointOnLine(point, left) && isConnectionAngleRight("left", angle)) ||
    (isPointOnLine(point, right) && isConnectionAngleRight("right", angle)) ||
    (isPointOnLine(point, bottom) && isConnectionAngleRight("bottom", angle))
  );
};
