import { ConnectionPoint, Point, Rect } from "../models";
import {
  getConnectionPointEdge,
  getRectBounds,
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
  const left =
    Math.min(
      rect1.position.x - rect1.size.width / 2,
      rect2.position.x - rect2.size.width / 2,
    ) - RECTANGLE_MARGIN;
  const right =
    Math.max(
      rect1.position.x + rect1.size.width / 2,
      rect2.position.x + rect2.size.width / 2,
    ) + RECTANGLE_MARGIN;
  const top =
    Math.min(
      rect1.position.y - rect1.size.height / 2,
      rect2.position.y - rect2.size.height / 2,
    ) - RECTANGLE_MARGIN;
  const bottom =
    Math.max(
      rect1.position.y + rect1.size.height / 2,
      rect2.position.y + rect2.size.height / 2,
    ) + RECTANGLE_MARGIN;

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
  const bounds1 = getRectBounds(rect1);
  const bounds2 = getRectBounds(rect2);

  const leftRect = bounds1.left <= bounds2.left ? bounds1 : bounds2;
  const topRect = bounds1.top <= bounds2.top ? bounds1 : bounds2;

  const rightRect = leftRect === bounds1 ? bounds2 : bounds1;
  const bottomRect = topRect === bounds1 ? bounds2 : bounds1;

  const xDistance = leftRect.right - rightRect.left;
  const yDistance = topRect.bottom - bottomRect.top;

  const xCenter = leftRect.right - xDistance / 2;
  const yCenter = bottomRect.bottom - yDistance / 2;

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
      { x: startCLine[1].x, y: path[0].y },
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

  const getMiddleProjection = (path: Segment) => {
    const isHorizontal = isHorizontalDirection(angle(direction(...path)));
    if (isHorizontal) {
      return getHorizontalProjection(path);
    } else {
      return getVerticalProjection(path);
    }
  };

  [
    ...Object.values(paths),
    middlePaths.horizontal,
    middlePaths.vertical,
  ].forEach((segment) => {
    const isHorizontal = isHorizontalDirection(angle(direction(...segment)));
    let middleSegment: Point[];
    if (isHorizontal) {
      middleSegment = getHorizontalProjection(segment);
    } else {
      middleSegment = getVerticalProjection(segment);
    }

    const path = [startPoint, ...middleSegment, endPoint];

    if (
      !isLineIntersectRect(path, rect1) &&
      !isLineIntersectRect(path, rect2)
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

  if (isRectangleIntersect(rect1, rect2)) {
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
