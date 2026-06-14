const { createCacheClient, getItem, setItem, removeItem, hasItem, getOrSet } = require('.');

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

  it('should check if item exists', async () => {
    expect(await hasItem(client, TEST_KEY)).toBe(false);
    await setItem(client, TEST_KEY, 'exists');
    expect(await hasItem(client, TEST_KEY)).toBe(true);
    await removeItem(client, TEST_KEY);
    expect(await hasItem(client, TEST_KEY)).toBe(false);
  });

  it('should getOrSet — cache miss calls factory', async () => {
    const factory = jest.fn().mockResolvedValue({ computed: true });
    const result = await getOrSet(client, TEST_KEY, factory);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ computed: true });
    expect(await getItem(client, TEST_KEY)).toEqual({ computed: true });
  });

  it('should getOrSet — cache hit skips factory', async () => {
    await setItem(client, TEST_KEY, { cached: true });
    const factory = jest.fn().mockResolvedValue({ computed: true });
    const result = await getOrSet(client, TEST_KEY, factory);

    expect(factory).not.toHaveBeenCalled();
    expect(result).toEqual({ cached: true });
  });

  it('should getOrSet — cache null values still call factory', async () => {
    await setItem(client, TEST_KEY, null);
    const factory = jest.fn().mockResolvedValue({ fresh: true });
    const result = await getOrSet(client, TEST_KEY, factory);

    // null is a valid cached value, so factory should NOT be called
    expect(factory).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });
});