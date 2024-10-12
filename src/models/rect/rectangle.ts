import { Shape } from "../shape";
import { Point } from "../point";
import { Size } from "../size";
import { lerpPoint, minmax } from "../../math";
import { getRectEdges, EdgeTypeAngle } from "../../utils";
import { CPoint } from "../connection-point";
import { Rect } from "./types";

export class Rectangle implements Shape, Rect {
  private static MIN_CONNECTION_POINT_POSITION = 0.1;
  private static MAX_CONNECTION_POINT_POSITION = 0.9;

  constructor(
    public position: Point,
    public size: Size,
  ) {}

  getConnectionPoint(
    type: "top" | "left" | "right" | "bottom",
    position: number,
  ): CPoint {
    const edges = getRectEdges(this);
    const [a, b] = edges[type];
    /** position between 0.1 - 0.9 */
    const offsetPosition = minmax(
      Rectangle.MIN_CONNECTION_POINT_POSITION,
      Rectangle.MAX_CONNECTION_POINT_POSITION,
    )(position);

    const point = lerpPoint(a, b, offsetPosition);
    const cPoint = new CPoint({ x: point.x, y: point.y, angle: 0 });
    cPoint.setRadians(EdgeTypeAngle[type]);

    return cPoint;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const left = this.position.x - this.size.width / 2;
    const top = this.position.y - this.size.height / 2;
    ctx.strokeRect(left, top, this.size.width, this.size.height);
  }
}
