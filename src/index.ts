const canvas = document.getElementById("root") as HTMLCanvasElement;
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (!context) {
  throw new Error("No Canvas Rendering Context");
}
