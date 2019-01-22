const gilesSrc = require("./giles.png");
const beachSrc = require("./beach.jpg");

// I picked this value because it's half of 400x300, and it gives nice chunky pixels
const width = 192;
const height = 108;
const maxBalls = 100;
const colors = ["white", "cyan", "magenta", "yellow"];

const drawBackground = (ctx, background) => {
  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, background.w, background.h);
};

const drawTexture = (ctx, texture) => {
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

const drawBall = (ctx, ball) => {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
};

const drawBalls = (ctx, balls) => {
  for (let i = 0; i < balls.length; i++) {
    drawBall(ctx, balls[i]);
  }
};

const draw = state => {
  const { ctx, background, balls, texture } = state;
  drawBackground(ctx, background);
  drawBalls(ctx, balls);
  drawTexture(ctx, texture);
};

const updateTexture = state => {
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

const update = state => {
  updateTexture(state);
  updateBalls(state);
};

const step = state => timestamp => {
  update(state);
  draw(state);
  window.requestAnimationFrame(step(state));
};

const setupBackground = (color = "white", w = 160, h = 90) => {
  return { color, w, h };
};

const setupTexture = src => {
  const img = new Image();
  img.src = src;
  return {
    img,
    xInhale: true,
    yInhale: true,
    enabled: true,
    speed: 1
  };
};

const setupBalls = (maxBalls = 5) => {
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

const setup = state => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const background = setupBackground("#334", canvas.width, canvas.height);
  const texture = setupTexture(beachSrc);
  const balls = setupBalls(maxBalls);

  canvas.width = width;
  canvas.height = height;

  state.canvas = canvas;
  state.ctx = ctx;
  state.background = background;
  state.balls = balls;
  state.texture = texture;
};

let state = {};
setup(state);
window.requestAnimationFrame(step(state));
