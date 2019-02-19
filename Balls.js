import { ballGraphics } from "./drawing";
import { setter } from "./state";

const SPEED_SCALE = 1;
const MAX_SPEED = 3;
const GRAVITY = 0.1;

// Randomly returns -1 or 1
const flip = () => (Math.random() >= 0.5 ? 1 : -1);

const initialState = (
  maxBalls = 10,
  maxX = 160,
  maxY = 90,
  colors = ["black", "white"]
) => {
  const balls = [];
  const velocity = () => Math.random() * MAX_SPEED * flip();
  for (let i = 0; i < maxBalls; i += 1) {
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    const r = Math.random() * 3;
    const vx = velocity();
    const vy = velocity();
    const color = colors[Math.floor(Math.random() * colors.length)];
    const prev = { x, y, vx, vy };
    const graphics = ballGraphics(color, r);
    const ball = { x, y, r, vx, vy, color, prev, graphics };
    balls.push(ball);
  }
  return balls;
};

const updateBall = ({ ball, timing, width, height, set }) => {
  const { x, y, vx, vy } = ball;
  const { increment } = timing;
  const reverseX = x > width || x < 0 ? -1 : 1;
  const newVX = vx * reverseX;
  const newVY = y > height ? -50 * GRAVITY * Math.random() : vy + GRAVITY;
  const xOffset = newVX * increment * SPEED_SCALE;
  const yOffset = newVY * increment * SPEED_SCALE;
  const newX = x + xOffset;
  const newY = y + yOffset;
  set("prev.vx", vx);
  set("prev.vy", vy);
  set("prev.x", x);
  set("prev.y", y);
  set("vx", newVX);
  set("vy", newVY);
  set("x", newX);
  set("y", newY);
};

const update = ({ balls, timing, width, height }) => {
  balls.forEach(ball =>
    updateBall({ ball, timing, width, height, set: setter(ball) })
  );
};

export { initialState, update };
