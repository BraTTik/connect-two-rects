import { ConnectionPoint, Point, Rect } from "models";
import { isConnectionPointOnEdge } from "./utils";

export function dataConverter(
  rect1: Rect,
  rect2: Rect,
  cPoint1: ConnectionPoint,
  cPoint2: ConnectionPoint,
): Point[] {
  if (!isConnectionPointOnEdge(cPoint1, rect1)) {
    throw new Error(
      "ConnectionPoint1 is not on the edge of Rect1 or wrong connection angle",
    );
  }
  if (!isConnectionPointOnEdge(cPoint2, rect2)) {
    throw new Error(
      "ConnectionPoint2 is not on the edge of Rect2 or wrong connection angle",
    );
  }

  return [];
}
