import { error } from "./utility";

const parent = state => path => {
  let node;
  let next = state;
  const fragments = path.split(".");
  fragments.forEach(fragment => {
    node = next;
    if (next === undefined) {
      const msg = `The path could not be found in the state`;
      error({ msg, path, state });
      throw new Error(msg);
    }
    next = next[fragment];
  });
  return node;
};

const key = path => path.split(".").pop();

const setter = node => (path, value) => {
  parent(node)(path)[key(path)] = value;
};

// eslint-disable-next-line import/prefer-default-export
export { setter };
