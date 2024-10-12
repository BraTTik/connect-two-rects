import {
  getConnectionPointEdge,
  getRectEdges,
  isRectangleIntersect,
} from "../utils";
import { Rect, Rectangle } from "../../models";
import { describe, expect, test } from "@jest/globals";

const rect: Rect = {
  size: {
    width: 10,
    height: 20,
  },
  position: {
    x: 5,
    y: 10,
  },
};

describe("utils", () => {
  describe("getConnectionPointEdge", () => {
    const r = getRectEdges(rect);

    test("top edge", () => {
      const point = { x: 5, y: 0 };
      expect(getConnectionPointEdge({ point, angle: -90 }, rect)).toEqual(
        r.top,
      );
      expect(getConnectionPointEdge({ point, angle: 90 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: 0 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: -180 }, rect)).toBe(null);
    });

    test("bottom edge", () => {
      const point = { x: 5, y: 20 };
      expect(getConnectionPointEdge({ point, angle: 90 }, rect)).toEqual(
        r.bottom,
      );
      expect(getConnectionPointEdge({ point, angle: -90 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: 0 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: -180 }, rect)).toBe(null);
    });

    test("left edge", () => {
      const point = { x: 0, y: 10 };
      expect(getConnectionPointEdge({ point, angle: -180 }, rect)).toEqual(
        r.left,
      );

      expect(getConnectionPointEdge({ point, angle: -90 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: 90 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: 0 }, rect)).toBe(null);
    });

    test("right edge", () => {
      const point = { x: 10, y: 10 };
      expect(
        getConnectionPointEdge({ point: { x: 10, y: 10 }, angle: 0 }, rect),
      ).toEqual(r.right);

      expect(getConnectionPointEdge({ point, angle: -90 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: 90 }, rect)).toBe(null);
      expect(getConnectionPointEdge({ point, angle: -180 }, rect)).toBe(null);
    });
  });

  test("isRectangleIntersect", () => {
    const rect1 = new Rectangle({ x: 100, y: 100 }, { width: 50, height: 100 });
    const rect2 = new Rectangle({ x: 130, y: 130 }, { width: 50, height: 100 });
    const rect3 = new Rectangle({ x: 160, y: 160 }, { width: 50, height: 100 });

    expect(isRectangleIntersect(rect1, rect2)).toBe(true);
    expect(isRectangleIntersect(rect1, rect3)).toBe(false);
    expect(isRectangleIntersect(rect2, rect3)).toBe(true);
  });
});
