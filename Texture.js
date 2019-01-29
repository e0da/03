import BLANK_SRC from "./blank.png";

const SPEED_SCALE = 0.005;

const toggle = (activate, deactivate, current) => {
  if (activate) return true;
  if (deactivate) return false;
  return current;
};

const update = ({ texture, dt, set, width: w, height: h }) => {
  const { width, height, xInhale, yInhale, speed } = texture;

  const newXInhale = toggle(width <= 10, width >= w, xInhale);
  const newYInhale = toggle(height <= 10, height >= h, yInhale);
  const increment = speed * dt * SPEED_SCALE;
  const newWidth = xInhale ? width + increment : width - increment;
  const newHeight = yInhale ? height + increment : height - increment;

  set("xInhale", newXInhale);
  set("yInhale", newYInhale);
  set("width", newWidth);
  set("height", newHeight);
};

const initialState = (width = 160, height = 90, src = BLANK_SRC) => {
  const img = new Image();
  img.src = src;
  img.width = width;
  img.height = height;
  return {
    img,
    width,
    height,
    xInhale: true,
    yInhale: true,
    enabled: true,
    speed: 1
  };
};

export { initialState, update };
