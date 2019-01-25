// import GILES_SRC from "./giles.png";
import { setter } from "./state";
import * as Balls from "./Balls";
import * as Texture from "./Texture";
import * as Timing from "./Timing";
import * as Background from "./Background";
import BEACH_SRC from "./beach.jpg";
import draw from "./drawing";

const TEXTURE_SRC = BEACH_SRC;

const FRAME_RATE = 60;
const FRAME_STEPS = FRAME_RATE / 1000;
const WIDTH = 192;
const HEIGHT = 108;
const MAX_BALLS = 100;
const BALL_COLORS = ["white", "cyan", "magenta", "yellow"];

const update = (state, timestamp) => {
  const { width, height, timing, texture, balls } = state;
  Timing.update({ timing, timestamp, set: setter(timing) });
  Texture.update({ texture, width, height, set: setter(texture) });
  Balls.update({ balls, width, height, set: setter(balls) });
};

const step = state => timestamp => {
  update(state, timestamp);
  draw(state);
  window.requestAnimationFrame(step(state));
};

const setup = ({ set }) => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const now = performance.now();
  const timing = Timing.initialState(FRAME_STEPS, FRAME_RATE, now);
  const background = Background.initialState("#334", WIDTH, HEIGHT);
  const texture = Texture.initialState(WIDTH, HEIGHT, TEXTURE_SRC);
  const balls = Balls.initialState(MAX_BALLS, WIDTH, HEIGHT, BALL_COLORS);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  set("timing", timing);
  set("canvas", canvas);
  set("width", WIDTH);
  set("height", HEIGHT);
  set("ctx", ctx);
  set("background", background);
  set("balls", balls);
  set("texture", texture);
};

const state = {};
setup({ set: setter(state) });
window.requestAnimationFrame(step(state));
