import { MovableShape, Shape } from "models/shape";
import { PointerHelper } from "./pointer-helper";

type WorkspaceShape = Shape | MovableShape;

export class Workplace {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shapes: WorkspaceShape[] = [];
  private pointerHelper: PointerHelper;

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  set width(value: number) {
    this.canvas.width = value;
  }

  set height(value: number) {
    this.canvas.height = value;
  }

  constructor(id: string) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error("Can not find canvas element with id " + id);
    }

    this.context = this.canvas.getContext("2d")!;
    if (!this.context) {
      throw new Error("No Canvas Rendering Context");
    }
    this.pointerHelper = new PointerHelper(this.canvas);
    this.pointerHelper.on("click", console.log);
  }

  addShape(shape: WorkspaceShape) {
    this.shapes.push(shape);
  }

  removeShape(shape: WorkspaceShape) {
    this.shapes = this.shapes.filter((s) => s !== shape);
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  drawShape(shape: WorkspaceShape) {
    shape.draw(this.context);
  }

  update() {
    this.context.clearRect(0, 0, this.width, this.height);
    for (const shape of this.shapes) {
      this.drawShape(shape);
    }
  }
}
