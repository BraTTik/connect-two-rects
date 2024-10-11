import { isConnectionPointOnEdge } from "../utils";
import { Rect } from "models";
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
});
