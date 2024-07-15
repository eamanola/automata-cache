const { initCache, connectCache, closeCache } = require('../dist/index.bundle');

beforeAll(async () => {
  await initCache();
  await connectCache();
});

afterAll(async () => {
  await closeCache();
});
