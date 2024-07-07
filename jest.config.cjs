module.exports = {
  setupFilesAfterEnv: [
    './jest/jest.setup.redis.js',
    './jest/jest.setup.cache.js',
  ],
};
