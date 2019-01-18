const gilesSrc = require("./giles.png");

let state;

// I picked this value because it's half of 400x300, and it gives nice chunky pixels
const width = 200;
const height = 150;

const drawBackground = () => {
  const { canvas, ctx, giles } = state;
  ctx.fillStyle = "#334";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawGiles = () => {
  const { ctx, giles } = state;
  const scale = 1;
  const w = giles.img.width * scale;
  const h = giles.img.height * scale;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;
  const originalSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(giles.img, x, y, w, h);
  ctx.imageSmoothingEnabled = originalSmoothing;
};

const drawBall = () => {
  const { ctx, ball } = state;
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
};

const draw = () => {
  drawBackground();
  drawBall();
  drawGiles();
};

const updateGiles = () => {
  const { giles } = state;
  const { img, xInhale, yInhale, speed } = giles;
  if (img.width < 10) state.giles.xInhale = true;
  if (img.width > width) state.giles.xInhale = false;
  if (img.height < 10) state.giles.yInhale = true;
  if (img.height > height) state.giles.yInhale = false;
  if (xInhale) state.giles.img.width += speed;
  else state.giles.img.width -= speed;
  if (yInhale) state.giles.img.height += speed;
  else state.giles.img.height -= speed;
};

const updateBall = () => {
  const { ball } = state;
  if (ball.x > width || ball.x < 0) state.ball.vx *= -1;
  if (ball.y > height || ball.y < 0) state.ball.vy *= -1;
  state.ball.x += ball.vx;
  state.ball.y += ball.vy;
};

const update = () => {
  updateGiles();
  updateBall();
};

const step = () => {
  update();
  draw();
  window.requestAnimationFrame(step);
};

const setupGiles = () => {
  const img = new Image();
  img.src = gilesSrc;
  return {
    img,
    xInhale: true,
    yInhale: true,
    speed: 1
  };
};

const setupBall = () => {
  const ballRadius = 3;
  return {
    x: width / 2 - ballRadius / 2,
    y: height / 2 - ballRadius / 2,
    r: ballRadius,
    vx: 2,
    vy: 1
  };
};

const setup = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const giles = setupGiles();
  const ball = setupBall();

  canvas.width = width;
  canvas.height = height;

  state = {
    canvas,
    ctx,
    ball,
    giles
  };
};

setup();
window.requestAnimationFrame(step);
