import { peek } from "./utility";

const maxFrameSkip = 5;

const initialState = (
  idealFramesPerSecond = 60,
  idealStepsPerFrame = 1,
  now = performance.now()
) => {
  const idealFrameTime = 1000 / idealFramesPerSecond;
  const last = now - idealFrameTime;
  const frameTime = now - last;
  const steps = idealStepsPerFrame;
  const leftover = 0.0;
  return {
    frameTime,
    idealFrameTime,
    idealFramesPerSecond,
    idealStepsPerFrame,
    last,
    now,
    steps,
    leftover
  };
};

const update = ({ timing, timestamp, set }) => {
  const { idealFrameTime, idealFramesPerSecond, idealStepsPerFrame } = timing;
  const last = timing.now;
  const now = timestamp;
  const frameTime = now - last;
  const maxSteps = maxFrameSkip * idealStepsPerFrame;
  const timeDemand = frameTime + timing.leftover;
  const stepDemand =
    (timeDemand * idealFramesPerSecond * idealStepsPerFrame) / 1000;
  const steps = Math.abs(Math.floor(Math.min(maxSteps, stepDemand)));
  const increment = 1 / steps;
  const simulated = steps * idealFrameTime;
  const leftover = Math.max(0, frameTime - simulated);
  set("now", now);
  set("last", last);
  set("frameTime", frameTime);
  set("steps", steps);
  set("increment", increment);
  set("leftover", leftover);
};

export { initialState, update };
