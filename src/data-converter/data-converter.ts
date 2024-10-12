import { ConnectionPoint, Point, Rect } from "models";
import { getConnectionPointEdge, isRectangleIntersect } from "../utils";

// const lineAngle = angle(direction(a, b)) in radians;

const RECTANGLE_MARGIN = 10;

const getPreConnectionPoint = (rect: Rect, cPoint: ConnectionPoint) => {};

export function dataConverter(
  rect1: Rect,
  rect2: Rect,
  cPoint1: ConnectionPoint,
  cPoint2: ConnectionPoint,
): Point[] {
  if (!getConnectionPointEdge(cPoint1, rect1)) {
    throw new Error(
      "ConnectionPoint1 is not on the edge of Rect1 or wrong connection angle",
    );
  }
  if (!getConnectionPointEdge(cPoint2, rect2)) {
    throw new Error(
      "ConnectionPoint2 is not on the edge of Rect2 or wrong connection angle",
    );
  }

  if (isRectangleIntersect(rect1, rect2)) {
    throw new Error("Rectangles intersect");
  }

  return [];
}
