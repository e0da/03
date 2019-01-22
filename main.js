const gilesSrc = require("./giles.png");
const beachSrc = require("./beach.jpg");

let state;

// I picked this value because it's half of 400x300, and it gives nice chunky pixels
const width = 192;
const height = 108;
const maxBalls = 100;
const colors = ["white", "cyan", "magenta", "yellow"];

const drawBackground = () => {
  const { canvas, ctx } = state;
  ctx.fillStyle = "#334";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawTexture = () => {
  const { ctx, texture } = state;
  if (!texture.enabled) return;
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

const drawBalls = () => {
  const { ctx, balls } = state;
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }
};

const draw = () => {
  drawBackground();
  drawBalls();
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

const updateBalls = () => {
  const { balls } = state;
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    if (ball.x > width || ball.x < 0) ball.vx *= -1;
    if (ball.y > height || ball.y < 0) ball.vy *= -1;
    ball.x += ball.vx;
    ball.y += ball.vy;
  }
};

const update = () => {
  updateTexture();
  updateBalls();
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
    enabled: true,
    speed: 1
  };
};

const setupBalls = () => {
  let balls = [];
  for (let i = 0; i < maxBalls; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const r = Math.random() * 3;
    const vx = Math.random() * 3;
    const vy = Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const ball = { x, y, r, vx, vy, color };
    balls.push(ball);
  }
  return balls;
};

const setup = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const texture = setupTexture();
  const balls = setupBalls();

  canvas.width = width;
  canvas.height = height;

  state = {
    canvas,
    ctx,
    balls,
    texture
  };
};

setup();
window.requestAnimationFrame(step);
