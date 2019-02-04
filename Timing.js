import { peek } from "./utility";

const maxFrameSkip = 5;

const initialState = (
  idealFrameRate = 60 / 1000 /* == 0.06 */,
  idealStepRate = Math.floor(1000 / 60) /* ~= 16.7 */,
  now = performance.now()
) => {
  const idealFrameTime = idealStepRate * idealFrameRate;
  const last = now - idealFrameTime;
  const elapsed = now - last;
  const frameBias = 1.0;
  const steps = idealStepRate;
  const unsimulated = 0.0;
  return {
    elapsed,
    frameBias,
    idealFrameRate,
    idealStepRate,
    last,
    now,
    steps,
    unsimulated
  };
};

const update = ({ timing, timestamp, set }) => {
  const { idealFrameRate, idealStepRate } = timing;
  const last = timing.now;
  const now = timestamp;
  const elapsed = now - last;
  // const pending = elapsed + timing.unsimulated;
  // const steps = Math.max(100, pending / idealStepRate);
  // const steps = 1 / idealStepRate;

  const maxSteps = maxFrameSkip / idealStepRate;
  const stepDemand = elapsed * idealFrameRate * (1 / idealStepRate);
  const steps = Math.floor(Math.max(0, Math.min(maxSteps, stepDemand)));
  const increment = 1 / steps;
  peek("step", { steps, increment, maxSteps, stepDemand });
  // const simulated = steps * idealStepRate;
  // const unsimulated = pending - simulated;
  // const frameBias = unsimulated / elapsed;
  // peek("simulating", { elapsed, pending, steps });
  // set("unsimulated", unsimulated);
  // set("frameBias", frameBias);
  // set("elapsed", elapsed);
  // set("last", last);
  set("now", now);
  set("steps", steps);
  set("increment", increment);
};

export { initialState, update };
