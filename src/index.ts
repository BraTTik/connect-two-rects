import { Line, Point, Rectangle } from "./models";
import { Workplace } from "./workplace";
import { dataConverter } from "./data-converter";
import { growRect } from "./utils";

const workplace = new Workplace("root");
workplace.height = window.innerHeight;
workplace.width = window.innerWidth;

const rect1 = new Rectangle({ x: 100, y: 100 }, { width: 50, height: 100 });
const rect2 = new Rectangle({ x: 400, y: 100 }, { width: 50, height: 100 });

const line = new Line();

const debugLine = new Line();
debugLine.color = "red";

workplace.addShape(rect1);
workplace.addShape(rect2);
workplace.addShape(line);
workplace.addShape(debugLine);

const redrawConnectionLine = () => {
  const cPoint1 = rect1.getConnectionPoint("top", 0.5);
  const cPoint2 = rect2.getConnectionPoint("bottom", 0.5);
  try {
    rect1.stroke = "black";
    rect2.stroke = "black";
    line.points = dataConverter(rect1, rect2, cPoint1, cPoint2);
  } catch {
    line.points = [];
    rect1.stroke = "red";
    rect2.stroke = "red";
  }
};

workplace.on("update", redrawConnectionLine);

workplace.update();
