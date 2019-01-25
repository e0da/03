import { setter } from "./state";

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
    const vx = Math.random() * 3;
    const vy = Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const ball = { x, y, r, vx, vy, color };
    balls.push(ball);
  }
  return balls;
};

const updateBall = ({ ball, set, width, height }) => {
  const { x, y, vx, vy } = ball;
  const reverseX = x > width || x < 0 ? -1 : 1;
  const reverseY = y > height || y < 0 ? -1 : 1;
  const newVX = vx * reverseX;
  const newVY = vy * reverseY;
  const newX = x + newVX;
  const newY = y + newVY;
  set("vx", newVX);
  set("vy", newVY);
  set("x", newX);
  set("y", newY);
};

const update = ({ balls, width, height }) => {
  balls.forEach(ball => updateBall({ ball, width, height, set: setter(ball) }));
};

export { initialState, update };
