const factory = require('.');

describe('cache test', () => {
  const TEST_KEY = 'foo';
  const client = factory({ AUTOMATA_CACHE: 'use-mock' });

  beforeAll(async () => {
    await client.connectCache();
  });

  afterAll(() => client.closeCache());

  afterEach(() => client.removeItem(TEST_KEY));

  it('should set and get item', async () => {
    const obj = { bar: 1 };
    await client.setItem(TEST_KEY, obj);
    expect(await client.getItem(TEST_KEY)).toEqual(obj);

    const str = 'bar';
    await client.setItem(TEST_KEY, str);
    expect(await client.getItem(TEST_KEY)).toBe(str);

    const num = 1;
    await client.setItem(TEST_KEY, num);
    expect(await client.getItem(TEST_KEY)).toBe(num);

    const NULL = null;
    await client.setItem(TEST_KEY, NULL);
    expect(await client.getItem(TEST_KEY)).toBe(NULL);

    const UNDEFINED = undefined;
    await client.setItem(TEST_KEY, UNDEFINED);
    // Redis returns null, instead of undefined
    expect(await client.getItem(TEST_KEY)).toBeFalsy();
  });

  it('should remove item', async () => {
    const obj = { bar: 1 };
    await client.setItem(TEST_KEY, obj);
    await client.removeItem(TEST_KEY);
    expect(await client.getItem(TEST_KEY)).toBeFalsy();
  });

  it('should remove list of items', async () => {
    const keys = ['foo', 'bar'];
    const value = 'val';

    await Promise.all(keys.map((key) => client.setItem(key, value)));
    (await Promise.all(keys.map((key) => client.getItem(key))))
      .forEach((val) => expect(val).toBe(value));

    await client.removeItem(keys);

    (await Promise.all(keys.map((key) => client.getItem(key))))
      .forEach((val) => expect(val).toBeFalsy());
  });

  it('should check if item exists', async () => {
    expect(await client.hasItem(TEST_KEY)).toBe(false);
    await client.setItem(TEST_KEY, 'exists');
    expect(await client.hasItem(TEST_KEY)).toBe(true);
    await client.removeItem(TEST_KEY);
    expect(await client.hasItem(TEST_KEY)).toBe(false);
  });
});
