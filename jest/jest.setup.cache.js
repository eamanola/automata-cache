const { initCache, connectCache, closeCache } = require('../src/lib');

beforeAll(async () => {
  await initCache();
  await connectCache();
});

afterAll(async () => {
  await closeCache();
});
