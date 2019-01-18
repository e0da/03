const gilesSrc = require("./giles.png");

let state;

// SNES-ish resolution
const width = 512 / 4;
const height = 384 / 4;

const draw = () => {
  const { canvas, ctx, giles } = state;
  // Draw a bordered rectangle with a greeting
  ctx.fillStyle = "#334";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Giles
  const scale = 1;
  const w = giles.width * scale;
  const h = giles.height * scale;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;
  const originalSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(giles, x, y, w, h);
  ctx.imageSmoothingEnabled = originalSmoothing;
};

const update = () => {
  const { giles, gilesSpeed, xInhale, yInhale } = state;
  if (giles.width < 10) state.xInhale = true;
  if (giles.width > width) state.xInhale = false;
  if (giles.height < 10) state.yInhale = true;
  if (giles.height > height) state.yInhale = false;
  if (xInhale) state.giles.width += gilesSpeed;
  else state.giles.width -= gilesSpeed;
  if (yInhale) state.giles.height += gilesSpeed;
  else state.giles.height -= gilesSpeed;
};

const step = () => {
  update();
  draw();
  window.requestAnimationFrame(step);
};

const setup = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const giles = new Image();
  giles.src = gilesSrc;
  canvas.width = width;
  canvas.height = height;

  state = {
    canvas,
    ctx,
    giles,
    xInhale: true,
    yInhale: true,
    gilesSpeed: 1
  };
};

setup();
window.requestAnimationFrame(step);
