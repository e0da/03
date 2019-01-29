import { setter } from "./state";

const SPEED_SCALE = 0.001;
const MAX_SPEED = 10;

const initialState = (
  maxBalls = 10,
  maxX = 160,
  maxY = 90,
  colors = ["black", "white"]
) => {
  const balls = [];
  for (let i = 0; i < maxBalls; i += 1) {
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    const r = Math.random() * 3;
    const vx = Math.random() * MAX_SPEED;
    const vy = Math.random() * MAX_SPEED;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const prev = { x, y, vx, vy };
    const ball = { x, y, r, vx, vy, color, prev };
    balls.push(ball);
  }
  return balls;
};

const updateBall = ({ ball, dt, width, height, set }) => {
  const { x, y, vx, vy } = ball;
  const reverseX = x > width || x < 0 ? -1 : 1;
  const reverseY = y > height || y < 0 ? -1 : 1;
  const newVX = vx * reverseX;
  const newVY = vy * reverseY;
  const xOffset = newVX * dt * SPEED_SCALE;
  const yOffset = newVY * dt * SPEED_SCALE;
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

const update = ({ balls, dt, width, height }) => {
  balls.forEach(ball =>
    updateBall({ ball, dt, width, height, set: setter(ball) })
  );
};

export { initialState, update };
