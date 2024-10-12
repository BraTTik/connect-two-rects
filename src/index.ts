import { Line, Rectangle } from "./models";
import { add, toXY } from "./math";
import { Workplace } from "./workplace";

const workplace = new Workplace("root");
workplace.height = window.innerHeight;
workplace.width = window.innerWidth;

const rect = new Rectangle({ x: 100, y: 100 }, { width: 50, height: 100 });
const rect3 = new Rectangle({ x: 400, y: 240 }, { width: 50, height: 100 });
const line = new Line();

workplace.addShape(rect);
workplace.addShape(rect3);
workplace.addShape(line);

const cPoint = rect.getConnectionPoint("top", 0.3);

const v1 = toXY({
  magnitude: 10,
  direction: cPoint.toRadians(),
});

const perpendicularPoint = add(cPoint, v1);

const v2 = toXY({
  magnitude: 100,
  direction: cPoint.toRadians() + Math.PI / 2,
});

const nextPoint = add(perpendicularPoint, v2);
line.points.push(cPoint, perpendicularPoint, nextPoint);

workplace.update();
