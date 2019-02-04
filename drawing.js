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

const drawBall = ctx => ball => {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
};

const drawBalls = (ctx, balls) => {
  balls.forEach(drawBall(ctx));
};

// TODO Use alpha to interpolate animation
const draw = state => {
  const { ctx, width, height, background, balls, texture, timing } = state;
  const { alpha } = timing;
  drawBackground(ctx, background);
  drawBalls(ctx, balls);
  // drawTexture(ctx, width, height, texture, alpha);
};

export default draw;
