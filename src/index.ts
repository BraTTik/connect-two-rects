import { Line, Point, Rectangle } from "./models";
import { Workplace } from "./workplace";
import { dataConverter } from "./data-converter";

const workplace = new Workplace("root");
workplace.height = window.innerHeight;
workplace.width = window.innerWidth;

const rect1 = new Rectangle({ x: 100, y: 100 }, { width: 50, height: 100 });
const rect2 = new Rectangle({ x: 400, y: 100 }, { width: 50, height: 100 });
const line = new Line();

workplace.addShape(rect1);
workplace.addShape(rect2);
workplace.addShape(line);

const cPoint1 = rect1.getConnectionPoint("top", 0.5);
const cPoint2 = rect2.getConnectionPoint("bottom", 0.5);

const linePoints = dataConverter(rect1, rect2, cPoint1, cPoint2);
line.points.push(...linePoints);

workplace.update();
