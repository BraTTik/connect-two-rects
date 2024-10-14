import { ConnectionPoint, Point, Rect } from "../models";
import {
  getConnectionPointEdge,
  getDistanceBetweenRects,
  getLeftRightRect,
  getRectBounds,
  growRect,
  isLineIntersectRect,
  isRectangleIntersect,
} from "../utils";
import { add, angle, direction, lineLength, toRadians, toXY } from "../math";

const RECTANGLE_MARGIN = 10;

type PathBounds = {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
};

type Segment = [Point, Point];

const isOppositeDirection = (
  pivotRadians: number,
  endLineRadians: number,
): boolean => {
  return Math.abs(pivotRadians) + Math.abs(endLineRadians) === Math.PI;
};

const isVerticalDirection = (angle: number) =>
  Math.abs(Number(Math.cos(angle).toFixed(2))) === 0;
const isHorizontalDirection = (angle: number) =>
  Math.abs(Number(Math.sin(angle).toFixed(2))) === 0;

const getPreConnectionPoint = (cPoint: ConnectionPoint) => {
  const vPoint = toXY({
    magnitude: RECTANGLE_MARGIN,
    direction: toRadians(cPoint.angle),
  });

  return add(cPoint.point, vPoint);
};

const createSimplestLine = (
  start: Point,
  end: Point,
  rect1: Rect,
  rect2: Rect,
) => {
  const verticalPoint: Point = { x: start.x, y: end.y };
  const horizontalPoint: Point = { x: end.x, y: start.y };

  const horizontalLine = [start, horizontalPoint, end];
  const verticalLine = [start, verticalPoint, end];

  if (
    !isLineIntersectRect(horizontalLine, rect1) &&
    !isLineIntersectRect(horizontalLine, rect2)
  ) {
    return horizontalLine;
  } else if (
    !isLineIntersectRect(verticalLine, rect1) &&
    !isLineIntersectRect(verticalLine, rect2)
  ) {
    return verticalLine;
  }

  return null;
};

const pathBounds = (rect1: Rect, rect2: Rect): PathBounds => {
  const bounds1 = getRectBounds(growRect(rect1, RECTANGLE_MARGIN * 2));
  const bounds2 = getRectBounds(growRect(rect2, RECTANGLE_MARGIN * 2));
  const left = Math.min(bounds1.left, bounds2.left);
  const right = Math.max(bounds2.right, bounds1.right);

  const top = Math.min(bounds1.top, bounds2.top);
  const bottom = Math.max(bounds1.bottom, bounds2.bottom);

  return {
    topLeft: { x: left, y: top },
    topRight: { x: right, y: top },
    bottomLeft: { x: left, y: bottom },
    bottomRight: { x: right, y: bottom },
  };
};

const getBoundsPaths = (
  bounds: PathBounds,
): { top: Segment; bottom: Segment; right: Segment; left: Segment } => {
  const { topLeft, topRight, bottomLeft, bottomRight } = bounds;

  return {
    top: [topLeft, topRight],
    left: [topLeft, bottomLeft],
    right: [topRight, bottomRight],
    bottom: [bottomLeft, bottomRight],
  };
};

const getMiddleEdges = (
  rect1: Rect,
  rect2: Rect,
): { horizontal: Segment; vertical: Segment } => {
  const { leftRect, bottomRect, topRect, rightRect } = getLeftRightRect(
    rect1,
    rect2,
  );
  const { xDistance, yDistance } = getDistanceBetweenRects(rect1, rect2);

  const xCenter = leftRect.right - xDistance / 2;
  const yCenter = topRect.bottom - yDistance / 2;

  return {
    horizontal: [
      { x: leftRect.left, y: yCenter },
      { x: rightRect.right, y: yCenter },
    ],
    vertical: [
      { x: xCenter, y: topRect.top },
      { x: xCenter, y: bottomRect.bottom },
    ],
  };
};

const findShortestPath = (
  startCLine: [Point, Point],
  endCLine: [Point, Point],
  rect1: Rect,
  rect2: Rect,
) => {
  const [cPoint1, startPoint] = startCLine;
  const [endPoint, cPoint2] = endCLine;

  const paths = getBoundsPaths(pathBounds(rect1, rect2));
  const middlePaths = getMiddleEdges(rect1, rect2);

  let shortestPath: { distance: number; points: Point[] } = {
    distance: Infinity,
    points: [],
  };

  const getHorizontalProjection = (path: Segment) => {
    const y = path[0].y;

    return [
      { x: startCLine[1].x, y },
      { x: endCLine[0].x, y },
    ];
  };

  const getVerticalProjection = (path: Segment) => {
    const x = path[0].x;
    return [
      { x, y: startCLine[1].y },
      { x, y: endCLine[0].y },
    ];
  };

  [
    ...Object.values(paths),
    middlePaths.horizontal,
    middlePaths.vertical,
  ].forEach((segment, index, arr) => {
    const isHorizontal = isHorizontalDirection(angle(direction(...segment)));
    let middleSegment: Point[];

    if (isHorizontal) {
      middleSegment = getHorizontalProjection(segment);
    } else {
      middleSegment = getVerticalProjection(segment);
    }
    const path = [startPoint, ...middleSegment, endPoint];

    if (
      !isLineIntersectRect(path, growRect(rect1, RECTANGLE_MARGIN * 2 - 1)) &&
      !isLineIntersectRect(path, growRect(rect2, RECTANGLE_MARGIN * 2 - 1))
    ) {
      const distance = lineLength(path);

      if (distance && distance < shortestPath.distance) {
        shortestPath = { distance, points: path };
      }
    }
  });

  shortestPath.points.unshift(cPoint1);
  shortestPath.points.push(cPoint2);

  return shortestPath.points;
};

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

  if (
    isRectangleIntersect(
      growRect(rect1, RECTANGLE_MARGIN * 2),
      growRect(rect2, RECTANGLE_MARGIN * 2),
    )
  ) {
    throw new Error("Rectangles intersect");
  }

  const preCPoint1 = getPreConnectionPoint(cPoint1);
  const preCPoint2 = getPreConnectionPoint(cPoint2);

  const simpleLinePoints = createSimplestLine(
    preCPoint1,
    preCPoint2,
    rect1,
    rect2,
  );

  if (simpleLinePoints) {
    return [cPoint1.point, ...simpleLinePoints, cPoint2.point];
  }

  const path = findShortestPath(
    [cPoint1.point, preCPoint1],
    [preCPoint2, cPoint2.point],
    rect1,
    rect2,
  );

  return path ?? [];
}
