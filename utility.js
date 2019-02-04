const { debug, log, warn, error } = console;

const peeks = {};
const peekTimers = {};
const peek = (obj, key = "DEFAULT") => {
  peeks[key] = obj;
  if (!peekTimers[key]) {
    const callback = () => debug(peeks[key]);
    peekTimers[key] = setInterval(callback, 1000);
    debug(`Peeking ${key} with interval ID ${peekTimers[key]}`);
    callback();
  }
};

const unpeek = key => {
  clearInterval(peekTimers[key]);
};

const times = (n, cb) => {
  for (let i = 0; i < n; i += 1) cb();
};

// Randomly returns -1 or 1
const flip = () => (Math.random() >= 0.5 ? 1 : -1);

export { debug, log, warn, error, peek, unpeek, times, flip };
