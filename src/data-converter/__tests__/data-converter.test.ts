import { dataConverter } from "../data-converter";
import { describe, expect, test } from "@jest/globals";
import { ConnectionPoint, Rect } from "models";

const W = 10;
const H = 20;

const createRectWithCPoint = (
  x: number,
  y: number,
): { rect: Rect; cPoint: ConnectionPoint } => ({
  rect: {
    size: { width: W, height: H },
    position: { x, y },
  },
  cPoint: {
    point: {
      x: x - W / 2,
      y: y,
    },
    angle: -180,
  },
});

const { rect: rect1, cPoint: cPoint1 } = createRectWithCPoint(5, 10);
const { rect: rect2, cPoint: cPoint2 } = createRectWithCPoint(5, 10);
const wrongCPoint = { ...cPoint2, angle: 90 };

describe("dataConverter", () => {
  test("throws as error on wrong connection point", () => {
    expect(() => dataConverter(rect1, rect2, cPoint1, wrongCPoint)).toThrow(
      Error,
    );
  });
});
