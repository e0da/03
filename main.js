// const gilesSrc = require("./giles.png");
const BEACH_SRC = require("./beach.jpg");

const TEXTURE_SRC = BEACH_SRC;

// const { log, warn, error } = console;

const FRAME_RATE = 60;
const FRAME_STEPS = FRAME_RATE / 1000;
const WIDTH = 192;
const HEIGHT = 108;
const MAX_BALLS = 100;
const BALL_COLORS = ["white", "cyan", "magenta", "yellow"];

const drawBackground = (ctx, background) => {
  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, background.w, background.h);
};

const drawTexture = (ctx, texture) => {
  if (!texture.enabled) return;
  const scale = 1;
  const w = texture.img.width * scale;
  const h = texture.img.height * scale;
  const x = WIDTH / 2 - w / 2;
  const y = HEIGHT / 2 - h / 2;
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
  for (let i = 0; i < balls.length; i += 1) drawBall(ctx, balls[i]);
};

const draw = state => {
  const { ctx, background, balls, texture } = state;
  drawBackground(ctx, background);
  drawBalls(ctx, balls);
  drawTexture(ctx, texture);
};

const updateTexture = texture => {
  const { img, xInhale, yInhale, speed } = texture;

  if (img.width < 10) texture.xInhale = true;
  if (img.width > WIDTH) texture.xInhale = false;
  if (img.height < 10) texture.yInhale = true;
  if (img.height > HEIGHT) texture.yInhale = false;

  if (xInhale) texture.img.width += speed;
  else texture.img.width -= speed;
  if (yInhale) texture.img.height += speed;
  else texture.img.height -= speed;
};

const updateBall = ball => {
  if (ball.x > WIDTH || ball.x < 0) ball.vx *= -1;
  if (ball.y > HEIGHT || ball.y < 0) ball.vy *= -1;
  ball.x += ball.vx;
  ball.y += ball.vy;
};

const updateBalls = balls => {
  for (let i = 0; i < balls.length; i += 1) updateBall(balls[i]);
};

const updateTiming = (timing, timestamp) => {
  const last = timing.now;
  const now = timestamp;
  const dt = now - last;

  timing.last = last;
  timing.now = now;
  timing.dt = dt;
};

const update = (state, timestamp) => {
  updateTiming(state.timing, timestamp);
  updateTexture(state.texture);
  updateBalls(state.balls);
};

const step = state => timestamp => {
  update(state, timestamp);
  draw(state);
  window.requestAnimationFrame(step(state));
};

const setupBackground = (color = "white", w = 160, h = 90) => ({ color, w, h });

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
  const balls = [];
  for (let i = 0; i < maxBalls; i += 1) {
    const x = Math.floor(Math.random() * WIDTH);
    const y = Math.floor(Math.random() * HEIGHT);
    const r = Math.random() * 3;
    const vx = Math.random() * 3;
    const vy = Math.random() * 3;
    const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
    const ball = { x, y, r, vx, vy, color };
    balls.push(ball);
  }
  return balls;
};

const setupTiming = (frameSteps, frameRate, now) => {
  const typicalFrameTime = frameSteps * frameRate;
  const last = now - typicalFrameTime;
  const dt = now - last;
  return { last, now, dt };
};

const setup = state => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const now = performance.now();
  const timing = setupTiming(FRAME_STEPS, FRAME_RATE, now);
  const background = setupBackground("#334", WIDTH, HEIGHT);
  const texture = setupTexture(TEXTURE_SRC);
  const balls = setupBalls(MAX_BALLS);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  state.timing = timing;
  state.canvas = canvas;
  state.ctx = ctx;
  state.background = background;
  state.balls = balls;
  state.texture = texture;
};

const state = {};
setup(state);
window.requestAnimationFrame(step(state));
