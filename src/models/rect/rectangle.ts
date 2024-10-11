import { Shape } from "../shape";
import { Rect } from "./types";
import { Point } from "../point";
import { Size } from "../size";

export class Rectangle implements Shape, Rect {
  constructor(
    public position: Point,
    public size: Size,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    const left = this.position.x - this.size.width / 2;
    const top = this.position.y - this.size.height / 2;
    ctx.strokeRect(left, top, this.size.width, this.size.height);
  }
}
