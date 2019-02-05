import { peek } from "./utility";

const drawBackground = (ctx, background) => {
  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, background.w, background.h);
};

const drawTexture = (ctx, width, height, texture) => {
  if (!texture.enabled) return;
  const scale = 1;
  const w = texture.width * scale;
  const h = texture.height * scale;
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
  const x = ball.x * frameBias + (1 - frameBias) * ball.prev.x;
  const y = ball.y * frameBias + (1 - frameBias) * ball.prev.y;
  peek({ y, prev: ball.prev.y, cur: ball.y }, "balls");
  ctx.arc(x, y, ball.r, 0, Math.PI * 2);
  ctx.fill();
};

const drawBalls = ({ ctx, timing, balls }) => {
  balls.forEach(drawBall(ctx, timing));
};

// TODO Use alpha to interpolate animation
const draw = state => {
  const { ctx, width, height, background, balls, texture, timing } = state;
  const { alpha } = timing;
  drawBackground(ctx, background);
  drawBalls({ ctx, timing, balls });
  // drawTexture(ctx, width, height, texture, alpha);
};

export default draw;
