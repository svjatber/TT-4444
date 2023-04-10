// canvas
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const RADIUS = 5;
const WIDTH = window.innerWidth;
const HEIGHT = window.outerHeight;
const ITERATION = 100001;
const ANIMATED_SHAPES = 2001;
const DURATION = 2000

canvas.style.background = "yellow";
canvas.height = HEIGHT;
canvas.width = WIDTH;
ctx.font = `${RADIUS * 1.5}px serif`;

class Shape {
  _mark = false;
  constructor(x, y, color = null) {
    this.x = x;
    this.y = y;
    this._color = color;
  }

  get color() {
    return this._color;
  }

  set color(val) {
    fillCanvasCircle(this.x, this.y, val);
    this._color = val;
    if (this._mark) markShape(this.x, this.y);
  }

  mark() {
    markShape(this.x, this.y);
    this._mark = true;
  }
}
const shapes = [];

function markShape(x, y) {
  ctx.fillStyle = "#000000";
  ctx.fillText("✓", x - RADIUS / 2, y + RADIUS / 2);
}

function randomColor() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  return "rgba(" + r + "," + g + "," + b + ",1)";
}

function fillCanvasCircle(x, y, color, radius = RADIUS) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 2, 0, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// dialog
const dialog = document.getElementById("dialog");
const colorSection = document.querySelector("#color");
let modalState = null;
canvas.addEventListener(
  "click",
  function (evt) {
    const rect = evt.target.getBoundingClientRect();

    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;

    const shape = shapes.find(
      (s) =>
        x >= s.x - RADIUS &&
        x <= s.x + RADIUS &&
        y >= s.y - RADIUS &&
        y <= s.y + RADIUS
    );
    shape.mark();

    colorSection.style.backgroundColor = shape.color;
    modalState = shape;
    dialog.showModal();
  },
  false
);

const generate = function () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  let x0 = RADIUS;
  let y0 = RADIUS;

  function animate(duration) {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;

      if (timeFraction > 1) {
        for (let i = 0; i < ANIMATED_SHAPES; i++) {
          const i = Math.floor(Math.random() * ITERATION);
          let color = randomColor();
          shapes[i].color = color;
          if (modalState?.x === shapes[i].x && modalState?.y === shapes[i].y) {
            colorSection.style.backgroundColor = color;
          }
        }
        start = time;
      }

      requestAnimationFrame(animate);
    });
  }

  for (let i = 0; i < ITERATION; i++) {
    let x = x0;
    let y = y0;

    if (x0 > window.innerWidth) {
      y0 += RADIUS * 2;
      x0 = RADIUS;
    } else {
      x0 += RADIUS * 2;
    }

    let color = randomColor();

    const shape = new Shape(x, y)
    shape.color = color
    shapes.push(shape);
  }

  animate(DURATION);
};

generate();

// The color of the graphical objects is changeable
let graphicalObject = shapes[2];
graphicalObject.color = "blue";
