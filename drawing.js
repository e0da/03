import * as PIXI from "pixi.js";
import { peek, warn } from "./utility";

const interpolate = (bias, obj, key) =>
  obj.prev[key] + (obj[key] - obj.prev[key]) * bias;

const drawBackground = (ctx, background) => {
  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, background.w, background.h);
};

const drawTexture = ({ ctx, width, height, texture, timing }) => {
  if (!texture.enabled) return;
  const { frameBias } = timing;
  const w = interpolate(frameBias, texture, "width");
  const h = interpolate(frameBias, texture, "height");
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;
  const originalSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(texture.img, x, y, w, h);
  ctx.imageSmoothingEnabled = originalSmoothing;
};

const drawBall = (ctx, timing) => ball => {
  const { frameBias } = timing;
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  const x = interpolate(frameBias, ball, "x");
  const y = interpolate(frameBias, ball, "y");
  ctx.arc(x, y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  peek(ball, "ball drawing");
};

const drawBalls = ({ ctx, timing, balls }) => {
  balls.forEach(drawBall(ctx, timing));
};

const draw = state => {
  const { ctx, width, height, background, balls, texture, timing } = state;
  drawBackground(ctx, background);
  drawBalls({ ctx, timing, balls });
  drawTexture({ ctx, width, height, texture, timing });
};

const ballGraphics = (cx, cy, color, radius) => {
  const graphics = new PIXI.Graphics();
  graphics.cacheAsBitmap = true;
  graphics.beginFill(color);
  graphics.arc({ cx, cy, radius });
  graphics.endFill();
  return graphics;
};

export { ballGraphics, draw };
