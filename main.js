const gilesSrc = require("./giles.png");
const beachSrc = require("./beach.jpg");

let state;

// I picked this value because it's half of 400x300, and it gives nice chunky pixels
const width = 200;
const height = 150;

const drawBackground = () => {
  const { canvas, ctx } = state;
  ctx.fillStyle = "#334";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawTexture = () => {
  const { ctx, texture } = state;
  const scale = 1;
  const w = texture.img.width * scale;
  const h = texture.img.height * scale;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;
  const originalSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(texture.img, x, y, w, h);
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
  drawTexture();
};

const updateTexture = () => {
  const { texture } = state;
  const { img, xInhale, yInhale, speed } = texture;

  if (img.width < 10) state.texture.xInhale = true;
  if (img.width > width) state.texture.xInhale = false;
  if (img.height < 10) state.texture.yInhale = true;
  if (img.height > height) state.texture.yInhale = false;

  if (xInhale) state.texture.img.width += speed;
  else state.texture.img.width -= speed;
  if (yInhale) state.texture.img.height += speed;
  else state.texture.img.height -= speed;
};

const updateBall = () => {
  const { ball } = state;
  if (ball.x > width || ball.x < 0) state.ball.vx *= -1;
  if (ball.y > height || ball.y < 0) state.ball.vy *= -1;
  state.ball.x += ball.vx;
  state.ball.y += ball.vy;
};

const update = () => {
  updateTexture();
  updateBall();
};

const step = () => {
  update();
  draw();
  window.requestAnimationFrame(step);
};

const setupTexture = () => {
  const img = new Image();
  img.src = beachSrc;
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
  const texture = setupTexture();
  const ball = setupBall();

  canvas.width = width;
  canvas.height = height;

  state = {
    canvas,
    ctx,
    ball,
    texture
  };
};

setup();
window.requestAnimationFrame(step);
