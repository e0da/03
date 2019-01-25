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

const parent = state => path => {
  let node;
  let next = state;
  const fragments = path.split(".");
  fragments.forEach(fragment => {
    node = next;
    if (next === undefined) {
      const msg = `The path could not be found in the state`;
      error({ msg, path, state });
      throw new Error(msg);
    }
    next = next[fragment];
  });
  return node;
};

const key = path => path.split(".").pop();

/**
 * Returns a getter for reading values from an object. Returns the root object
 * if no path is provided.
 *
 * @example
 * const state = {pets: { cats: 2, dogs: 0}}
 * const get = getter(pets)
 * get() == { cats: 2, dogs: 0 }
 * get('cats') == 2
 *
 * @param {Object} node The object to be queried
 * @param {String} path A dot-separated path to the desired value, e.g. texture.img
 */
const getter = node => path => {
  if (!path) return node;
  return parent(node)(path)[key(path)];
};

const setter = node => (path, value) => {
  parent(node)(path)[key(path)] = value;
};

const accessors = node => ({
  get: getter(node),
  set: setter(node)
});

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

const draw = ({ get }) => {
  const { ctx, background, balls, texture } = get();
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

const updateBall = ({ get, set }) => {
  const { x, y, vx, vy } = get();
  const reverseX = x > WIDTH || x < 0 ? -1 : 1;
  const reverseY = y > HEIGHT || y < 0 ? -1 : 1;
  const newVX = vx * reverseX;
  const newVY = vy * reverseY;
  const newX = x + newVX;
  const newY = y + newVY;
  set("vx", newVX);
  set("vy", newVY);
  set("x", newX);
  set("y", newY);
};

const updateBalls = ({ get }) => {
  const balls = get();
  balls.forEach(ball => updateBall(accessors(ball)));
};

const updateTiming = ({ get, set }, timestamp) => {
  const last = get("now");
  const now = timestamp;
  const dt = now - last;
  set("last", last);
  set("now", now);
  set("dt", dt);
};

const update = ({ get }, timestamp) => {
  const { timing, texture, balls } = get();
  updateTiming(accessors(timing), timestamp);
  updateTexture(accessors(texture));
  updateBalls(accessors(balls));
};

const step = ({ get, set }) => timestamp => {
  update({ get, set }, timestamp);
  draw({ get });
  window.requestAnimationFrame(step({ get, set }));
};

const setupBackground = (color = "white", w = 160, h = 90) => ({ color, w, h });

const setupTexture = src => {
  const img = new Image();
  img.src = src;
  img.width = WIDTH;
  img.height = HEIGHT;
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

const setup = ({ set }) => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const now = performance.now();
  const timing = setupTiming(FRAME_STEPS, FRAME_RATE, now);
  const background = setupBackground("#334", WIDTH, HEIGHT);
  const texture = setupTexture(TEXTURE_SRC);
  const balls = setupBalls(MAX_BALLS);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  set("timing", timing);
  set("canvas", canvas);
  set("ctx", ctx);
  set("background", background);
  set("balls", balls);
  set("texture", texture);
};

const state = {};
setup(accessors(state));
window.requestAnimationFrame(step(accessors(state)));
