import BLANK_SRC from "./blank.png";

const toggle = (activate, deactivate, current) => {
  if (activate) return true;
  if (deactivate) return false;
  return current;
};

const update = ({ texture, timing, set, width: w, height: h }) => {
  const { width, height, xInhale, yInhale, speed } = texture;
  const newXInhale = toggle(width <= 10, width >= w, xInhale);
  const newYInhale = toggle(height <= 10, height >= h, yInhale);
  const increment = speed * timing.increment;
  const newWidth = xInhale ? width + increment : width - increment;
  const newHeight = yInhale ? height + increment : height - increment;
  set("prev.width", width);
  set("prev.height", height);
  set("xInhale", newXInhale);
  set("yInhale", newYInhale);
  set("width", newWidth);
  set("height", newHeight);
};

const initialImage = src => {
  const img = new Image();
  img.src = src;
  return img;
};

const initialState = ({
  width = 160,
  height = 90,
  src = BLANK_SRC,
  enabled = true
}) => {
  const img = initialImage(src);
  const prev = { width, height };
  return {
    img,
    width,
    height,
    prev,
    enabled,
    xInhale: true,
    yInhale: true,
    speed: 1
  };
};

export { initialState, update };
