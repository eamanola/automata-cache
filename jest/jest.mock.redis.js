// To test against redis server, see backend-empty
// out of scope of this package
const { REDIS_URL } = require('../src/config');

if (REDIS_URL === 'use-mock') {
  console.info('mocking redis');

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
} else {
  console.info(`skipping mock. make sure redis server is running and REDIS_TEST_URL is set.
to use mock set REDIS_TEST_URL=use-mock`);
}
