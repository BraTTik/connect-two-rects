import { toDegree, toRadians } from "../../math";
import { Point } from "../point";
import { ConnectionPoint } from "./types";

export class CPoint implements ConnectionPoint, Point {
  #point: Point;
  #x: number;
  #y: number;
  public angle: number;

  get point(): Point {
    return this.#point;
  }

  set point(value: Point) {
    this.#point = value;
    this.#x = value.x;
    this.#y = value.y;
  }

  get y(): number {
    return this.#y;
  }

  set y(value: number) {
    this.#y = value;
    this.#point.y = value;
  }

  get x(): number {
    return this.#x;
  }

  set x(value: number) {
    this.#x = value;
    this.#point.x = value;
  }

  constructor(args: { x: number; y: number; angle: number }) {
    const { x, y, angle } = args;
    this.#x = x;
    this.#y = y;
    this.#point = { x, y };
    this.angle = angle;
  }

  setRadians(radians: number) {
    this.angle = toDegree(radians);
  }

  toRadians(): number {
    return toRadians(this.angle);
  }
}
