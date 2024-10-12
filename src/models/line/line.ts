import { Shape } from "../shape";
import { Point } from "../point";

export class Line implements Shape {
  public points: Point[];

  constructor(points: Point[] = []) {
    this.points = points;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;
    ctx.beginPath();

    const startPoint = this.points[0];
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 1; i < this.points.length; i++) {
      const nextPoint = this.points[i];
      ctx.lineTo(nextPoint.x, nextPoint.y);
    }
    ctx.stroke();
  }
}
