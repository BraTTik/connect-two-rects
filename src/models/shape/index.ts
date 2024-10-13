import { Point } from "models/point";

export interface Shape {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface MovableShape extends Shape {
  position: Point;
  move(position: Point): void;
  isIncludePoint(point: Point): boolean;
}
