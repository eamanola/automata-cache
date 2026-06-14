const { createCacheClient, getItem, setItem, removeItem } = require('.');

describe('cache test', () => {
  const TEST_KEY = 'foo';
  let client;

  beforeAll(async () => {
    client = createCacheClient();
    await client.connect();
  });

  afterAll(async () => {
    await client.disconnect();
  });

  afterEach(() => removeItem(client, TEST_KEY));

  it('should set and get item', async () => {
    const obj = { bar: 1 };
    await setItem(client, TEST_KEY, obj);
    expect(await getItem(client, TEST_KEY)).toEqual(obj);

    const str = 'bar';
    await setItem(client, TEST_KEY, str);
    expect(await getItem(client, TEST_KEY)).toBe(str);

    const num = 1;
    await setItem(client, TEST_KEY, num);
    expect(await getItem(client, TEST_KEY)).toBe(num);

    const NULL = null;
    await setItem(client, TEST_KEY, NULL);
    expect(await getItem(client, TEST_KEY)).toBe(NULL);

    const UNDEFINED = undefined;
    await setItem(client, TEST_KEY, UNDEFINED);
    // Redis returns null, instead of undefined
    expect(await getItem(client, TEST_KEY)).toBeFalsy();
  });

  it('should removeItem', async () => {
    const obj = { bar: 1 };
    await setItem(client, TEST_KEY, obj);
    await removeItem(client, TEST_KEY);
    expect(await getItem(client, TEST_KEY)).toBeFalsy();
  });

  it('should remove list of items', async () => {
    const keys = ['foo', 'bar'];
    const value = 'val';

    await Promise.all(keys.map((key) => setItem(client, key, value)));
    (await Promise.all(keys.map((key) => getItem(client, key))))
      .forEach((val) => expect(val).toBe(value));

    await removeItem(client, keys);

    (await Promise.all(keys.map((key) => getItem(client, key))))
      .forEach((val) => expect(val).toBeFalsy());
  });
});