const initialState = (
  frameSteps = 16.67,
  frameRate = 60,
  now = performance.now()
) => {
  const typicalFrameTime = frameSteps * frameRate;
  const last = now - typicalFrameTime;
  const dt = now - last;
  return { last, now, dt };
};

const update = ({ timing, timestamp, set }) => {
  const last = timing.now;
  const now = timestamp;
  const dt = now - last;
  set("last", last);
  set("now", now);
  set("dt", dt);
};

export { initialState, update };
