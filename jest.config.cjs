module.exports = {
  setupFiles: [
    './jest/jest.mock.redis.js',
  ],
  setupFilesAfterEnv: [
    './jest/jest.setup.cache.js',
  ],
};
