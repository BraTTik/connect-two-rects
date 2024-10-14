import { Line, Rectangle } from "./models";
import { Workplace } from "./workplace";
import { dataConverter } from "./data-converter";

const workplace = new Workplace("root");
workplace.height = window.innerHeight;
workplace.width = window.innerWidth;

type SelectValue = "top" | "bottom" | "left" | "right";
const rect1Select = document.getElementById("rect1") as HTMLSelectElement;
const rect2Select = document.getElementById("rect2") as HTMLSelectElement;

const rect1 = new Rectangle({ x: 100, y: 100 }, { width: 50, height: 100 });
const rect2 = new Rectangle({ x: 93, y: 250 }, { width: 50, height: 100 });
const line = new Line();

workplace.addShape(rect1);
workplace.addShape(rect2);
workplace.addShape(line);

var debugLine = new Line();
var debugRect = new Rectangle({ x: 0, y: 0 }, { width: 0, height: 0 });

window.line = debugLine;
workplace.addShape(debugLine);
workplace.addShape(debugRect);

window.update = () => {
  workplace.update();
};

const selectChange = () => {
  redrawConnectionLine();
  workplace.update();
};

const redrawConnectionLine = () => {
  const cPoint1 = rect1.getConnectionPoint(
    (rect1Select.value as SelectValue) || "top",
    0.5,
  );
  const cPoint2 = rect2.getConnectionPoint(
    (rect2Select.value as SelectValue) || "right",
    0.5,
  );

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

rect1Select.addEventListener("change", selectChange);
rect2Select.addEventListener("change", selectChange);
workplace.on("update", redrawConnectionLine);

workplace.update();
