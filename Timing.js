const initialState = (
  steps = 16.67,
  frameRate = 60,
  now = performance.now()
) => {
  const typicalFrameTime = steps * frameRate;
  const last = now - typicalFrameTime;
  const dt = now - last;
  const acc = 0.0;
  const alpha = 0.0;
  return {
    acc,
    alpha,
    dt,
    last,
    now,
    steps
  };
};

const update = ({ timing, timestamp, set }) => {
  const last = timing.now;
  const now = timestamp;
  const dt = now - last;
  const acc = timing.acc + dt;
  const alpha = acc / dt;
  set("acc", acc);
  set("alpha", alpha);
  set("dt", dt);
  set("last", last);
  set("now", now);
};

export { initialState, update };
