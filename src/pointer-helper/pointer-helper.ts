import { Evented, EventHandler, EventListeners } from "../event-listeners";
import { PointerEvents } from "./types";
import { Point } from "models";

export class PointerHelper implements Evented<PointerEvents> {
  private listeners: EventListeners<PointerEvents> = new EventListeners();
  private element: HTMLElement;
  private pointerPosition: Point = { x: 0, y: 0 };
  private isDragging: boolean = false;
  private isPointerDown: boolean = false;
  private clickSpeed = 200;
  private clickStart: number = 0;
  private pointerDragStart: Point = { x: 0, y: 0 };

  notify = this.listeners.notify.bind(this.listeners);
  off = this.listeners.off.bind(this.listeners);
  on = this.listeners.on.bind(this.listeners);

  constructor(element: HTMLElement) {
    this.element = element;

    window.addEventListener("pointermove", this.moveHandler);
    window.addEventListener("pointerdown", this.pointerDown);
    window.addEventListener("pointerup", this.pointerUp);
  }

  destroy() {
    window.removeEventListener("pointermove", this.moveHandler);
    window.addEventListener("pointerdown", this.pointerDown);
    window.addEventListener("pointerup", this.pointerUp);
  }

  private moveHandler = (event: PointerEvent) => {
    const { x, y } = event;
    this.pointerPosition = { x, y };
    if (this.isOverElement()) {
      this.notify("move", { event: this.pointerPosition });

      if (this.isPointerDown) {
        this.isDragging = true;
        this.notify("drag", {
          event: {
            currentPoint: { x, y },
            diff: {
              x: x - this.pointerDragStart.x,
              y: y - this.pointerDragStart.y,
            },
            startPoint: { ...this.pointerDragStart },
          },
        });
      }
    }
  };

  private pointerDown = (event: PointerEvent) => {
    const { x, y } = event;
    this.isPointerDown = true;
    this.clickStart = Date.now();
    this.pointerDragStart = { x, y };
  };

  private pointerUp = (event: PointerEvent) => {
    const { x, y } = event;
    this.isPointerDown = false;
    const clickEnd = Date.now();
    if (clickEnd - this.clickStart <= this.clickSpeed) {
      this.notify("click", { event: { x, y } });
    }

    if (this.isDragging) {
      this.isDragging = false;

      this.notify("dragend", {
        event: {
          currentPoint: { x, y },
          diff: {
            x: x - this.pointerDragStart.x,
            y: y - this.pointerDragStart.y,
          },
          startPoint: { ...this.pointerDragStart },
        },
      });
    }
  };

  private isOverElement = () => {
    if (!this.element) return true;
    const elementBounds = this.element.getBoundingClientRect();
    const {
      left = 0,
      top = 0,
      right = window.innerWidth,
      bottom = window.innerHeight,
    } = elementBounds;
    const { x, y } = this.pointerPosition;

    return x >= left && x <= right && y >= top && y <= bottom;
  };
}
