import { Rectangle } from "./models";

const canvas = document.getElementById("root") as HTMLCanvasElement;
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (!context) {
  throw new Error("No Canvas Rendering Context");
}

const rect = new Rectangle({ x: 100, y: 100 }, { width: 50, height: 100 });
const rect2 = new Rectangle({ x: 130, y: 130 }, { width: 50, height: 100 });
const rect3 = new Rectangle({ x: 160, y: 160 }, { width: 50, height: 100 });

rect.draw(context);
rect2.draw(context);
rect3.draw(context);
