import { Point } from "models";

export type PointerEvents = {
  click: { event: Point };
  drag: { event: { currentPoint: Point; diff: Point; startPoint: Point } };
  dragend: { event: { currentPoint: Point; diff: Point; startPoint: Point } };
  move: { event: Point };
};
