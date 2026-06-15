module.exports = () => {
  const cache = {};

  const mock = {
    closeCache: () => null,
    connectCache: () => null,
    getItem: (client, key) => cache[key],
    hasItem: (client, key) => !!cache[key],
    removeItem: (client, key) => {
      if (typeof key === 'string') {
        delete cache[key];
      } else if (Array.isArray(key)) {
        key.forEach((k) => delete cache[k]);
      }
    },
    setItem: (client, key, value) => { cache[key] = value; },
  };

  return mock;
};
