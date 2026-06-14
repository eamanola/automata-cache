const { createCacheClient, getItem, setItem, removeItem } = require('../src/lib');

let client;

beforeAll(async () => {
  client = createCacheClient();
  await client.connect();
});

afterAll(async () => {
  await client.disconnect();
});