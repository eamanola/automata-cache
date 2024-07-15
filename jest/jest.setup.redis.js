jest.mock('redis', () => {
  const cache = {};

  const redis = {
    createClient: () => ({
      connect: () => null,
      del: async (key) => {
        if (typeof key === 'string') {
          delete cache[key];
        } else if (Array.isArray(key)) {
          key.forEach((k) => redis.createClient().del(k));
        }
      },
      disconnect: () => null,
      get: async (key) => cache[key],
      set: async (key, value) => {
        cache[key] = value;
      },
    }),
  };

  return redis;
});
