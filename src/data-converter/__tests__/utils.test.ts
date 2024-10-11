import { isConnectionPointOnEdge, isRectangleIntersect } from "../utils";
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
  test("isConnectionPointOnEdge", () => {
    expect(
      isConnectionPointOnEdge({ point: { x: 0, y: 10 }, angle: -180 }, rect),
    ).toBe(true);
    expect(
      isConnectionPointOnEdge({ point: { x: 0, y: 10 }, angle: 0 }, rect),
    ).toBe(false);
    expect(
      isConnectionPointOnEdge({ point: { x: 5, y: 0 }, angle: -90 }, rect),
    ).toBe(true);
    expect(
      isConnectionPointOnEdge({ point: { x: 5, y: 0 }, angle: 90 }, rect),
    ).toBe(false);
    expect(
      isConnectionPointOnEdge({ point: { x: 5, y: 20 }, angle: 90 }, rect),
    ).toBe(true);
    expect(
      isConnectionPointOnEdge({ point: { x: 5, y: 20 }, angle: -90 }, rect),
    ).toBe(false);
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
