const { debug, log, warn, error } = console;

const times = (n, cb) => {
  for (let i = 0; i < n; i += 1) cb();
};

export { debug, log, warn, error, times };
