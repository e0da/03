// import GILES_SRC from "./giles.png";
import BEACH_SRC from "./beach.jpg";

const TEXTURE_SRC = BEACH_SRC;

const { /* debug, log, warn, */ error } = console;

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

const drawBall = ctx => ball => {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
};

const drawBalls = (ctx, balls) => {
  balls.forEach(drawBall(ctx));
};

const draw = state => {
  const { ctx, background, balls, texture } = state;
  drawBackground(ctx, background);
  drawBalls(ctx, balls);
  drawTexture(ctx, texture);
};

const toggle = (activate, deactivate, current) => {
  if (activate) return true;
  if (deactivate) return false;
  return current;
};

const updateTexture = ({ get, set }) => {
  const { img, xInhale, yInhale, speed } = get();
  const { width, height } = img;

  const newXInhale = toggle(width < 10, width > WIDTH, xInhale);
  const newYInhale = toggle(height < 10, height > HEIGHT, yInhale);
  set("xInhale", newXInhale);
  set("yInhale", newYInhale);

  const newWidth = xInhale ? width + speed : width - speed;
  const newHeight = yInhale ? height + speed : height - speed;
  set("img.width", newWidth);
  set("img.height", newHeight);
};

const updateBall = ball => {
  if (ball.x > WIDTH || ball.x < 0) ball.vx *= -1;
  if (ball.y > HEIGHT || ball.y < 0) ball.vy *= -1;
  ball.x += ball.vx;
  ball.y += ball.vy;
};

const updateBalls = balls => {
  balls.forEach(updateBall);
};

const updateTiming = (timing, timestamp) => {
  const last = timing.now;
  const now = timestamp;
  const dt = now - last;

  timing.last = last;
  timing.now = now;
  timing.dt = dt;
};

const key = path => path.split(".").pop();

const parent = state => path => {
  let node;
  let next = state;
  const fragments = path.split(".");
  fragments.forEach(fragment => {
    node = next;
    next = next[fragment];
    if (next === undefined) {
      const msg = `The path could not be found in the state`;
      error({ msg, path, state });
      throw new Error(msg);
    }
  });
  return node;
};

/**
 * Returns a getter for reading values from state. Returns the root state object if no path is provided.
 *
 * @example
 * const state = {pets: { cats: 2, dogs: 0}}
 * const get = getter(pets)
 * get() == { cats: 2, dogs: 0 }
 * get('cats') == 2
 *
 * @param {Object} state The state object to be queried
 * @param {String} path A dot-separated path to the desired value, e.g. texture.img
 */
const getter = state => path => {
  if (!path) return state;
  return parent(state)(path)[key(path)];
};

const setter = state => (path, value) => {
  parent(state)(path)[key(path)] = value;
};

const accessors = (gettable, settable) => ({
  get: getter(gettable),
  set: setter(settable)
});

const update = (state, timestamp) => {
  updateTiming(state.timing, timestamp);
  updateTexture(accessors(state.texture, state.texture));
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
