import { Shape } from "models/shape";

export class Workplace {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shapes: Shape[] = [];

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
  }

  addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  removeShape(shape: Shape) {
    this.shapes = this.shapes.filter((s) => s !== shape);
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  drawShape(shape: Shape) {
    shape.draw(this.context);
  }

  update() {
    this.context.clearRect(0, 0, this.width, this.height);
    for (const shape of this.shapes) {
      this.drawShape(shape);
    }
  }
}
