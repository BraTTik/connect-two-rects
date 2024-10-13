import { MovableShape, Shape } from "models/shape";
import { PointerEvents, PointerHelper } from "./pointer-helper";
import { Point } from "models";
import { Evented, EventListeners } from "./event-listeners";

type WorkspaceShape = Shape | MovableShape;

type WorkplaceEvents = {
  update: {};
};

export class Workplace implements Evented<WorkplaceEvents> {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private shapes: WorkspaceShape[] = [];
  private pointerHelper: PointerHelper;
  private movingShape: MovableShape | null = null;
  private initialMovablePosition: Point = { x: 0, y: 0 };
  private listeners: EventListeners<WorkplaceEvents> =
    new EventListeners<WorkplaceEvents>();

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
    this.pointerHelper.on("down", this.pointerDown);
    this.pointerHelper.on("up", this.pointerUp);
    this.pointerHelper.on("drag", this.handleDrag);
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
    this.notify("update", {});
    this.context.clearRect(0, 0, this.width, this.height);
    for (const shape of this.shapes) {
      this.drawShape(shape);
    }
  }

  private handleDrag = ({ event }: PointerEvents["drag"]) => {
    const { diff } = event;
    if (this.movingShape) {
      this.movingShape.move({
        x: this.initialMovablePosition.x + diff.x,
        y: this.initialMovablePosition.y + diff.y,
      });
      this.update();
    }
  };

  private pointerDown = ({ event }: PointerEvents["down"]) => {
    const { x, y } = event;

    for (const shape of this.shapes) {
      if ("move" in shape && shape.isContainsPoint({ x, y })) {
        this.movingShape = shape;
        this.initialMovablePosition = {
          x: shape.position.x,
          y: shape.position.y,
        };
        break;
      }
    }
  };

  private pointerUp = () => {
    this.movingShape = null;
  };

  notify = this.listeners.notify.bind(this.listeners);
  off = this.listeners.off.bind(this.listeners);
  on = this.listeners.on.bind(this.listeners);
}
