import BLANK_SRC from "./blank.png";

const toggle = (activate, deactivate, current) => {
  if (activate) return true;
  if (deactivate) return false;
  return current;
};

const update = ({ texture, set, width: w, height: h }) => {
  const { img, xInhale, yInhale, speed } = texture;
  const { width, height } = img;

  const newXInhale = toggle(width < 10, width > w, xInhale);
  const newYInhale = toggle(height < 10, height > h, yInhale);
  set("xInhale", newXInhale);
  set("yInhale", newYInhale);

  const newWidth = xInhale ? width + speed : width - speed;
  const newHeight = yInhale ? height + speed : height - speed;
  set("img.width", newWidth);
  set("img.height", newHeight);
};

const initialState = (width = 160, height = 90, src = BLANK_SRC) => {
  const img = new Image();
  img.src = src;
  img.width = width;
  img.height = height;
  return {
    img,
    xInhale: true,
    yInhale: true,
    enabled: true,
    speed: 1
  };
};

export { initialState, update };
