module.exports = () => {
  const cache = {};

  const redis = {
    createClient: () => ({
      connect: () => null,
      del: async (key) => {
        if (typeof key === 'string') {
          delete cache[key];
        } else if (Array.isArray(key)) {
          key.forEach((k) => delete cache[k]);
        }
      },
      disconnect: () => null,
      exists: async (key) => (key in cache ? 1 : 0),
      get: async (key) => cache[key] ?? null,
      set: async (key, value) => {
        cache[key] = value;
      },
    }),
  };

  return redis;
};
