const { debug, log, warn, error } = console;

const peeks = {};
const peekTimers = {};
const peek = (key, obj) => {
  peeks[key] = obj;
  if (!peekTimers[key]) {
    peekTimers[key] = setInterval(() => debug(peeks[key]), 1000);
    debug(`Peeking ${key} with interval ID ${peekTimers[key]}`);
  }
};

const unpeek = key => {
  clearInterval(peekTimers[key]);
};

const times = (n, cb) => {
  for (let i = 0; i < n; i += 1) cb();
};

export { debug, log, warn, error, peek, unpeek, times };
