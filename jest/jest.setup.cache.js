const { initCache, connectCache, closeCache } = require('../src');

beforeAll(async () => {
  await initCache();
  await connectCache();
});

afterAll(async () => {
  await closeCache();
});
