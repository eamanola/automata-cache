const { createClient } = require('redis');

const { REDIS_URL } = require('../../config');

const closeCache = async (client) => {
  await client.disconnect();
};

/**
 * Create a new Redis client instance.
 * The caller is responsible for managing the client lifecycle (connect, disconnect).
 *
 * @param {string} [url=REDIS_URL] - Redis connection URL
 * @returns {import('redis').RedisClientType} A new Redis client
 */

const connectCache = async (url = REDIS_URL) => {
  if (url === 'use-mock') {
    console.log('mocking redis');
    const redisMock = require('./redis-mock');
    return redisMock().createClient();
  }

  console.info(`skipping mock. make sure redis server is running and REDIS_TEST_URL is set.
to use mock set REDIS_TEST_URL=use-mock`);

  const client = createClient();
  await client.connect(url);

  return client;
};

/**
 * Remove an item from cache.
 * @param {import('redis').RedisClientType} client - Active Redis client
 * @param {string} key - Cache key
 */
const removeItem = async (client, key) => client.del(key);

/**
 * Set an item in cache.
 * @param {import('redis').RedisClientType} client - Active Redis client
 * @param {string} key - Cache key
 * @param {*} value - Value to cache (will be JSON-stringified)
 * @param {number} [expiresInSeconds=86400] - TTL in seconds (default 24h)
 */
const setItem = async (client, key, value, expiresInSeconds = 60 * 60 * 24) => {
  if (value === undefined) {
    return removeItem(client, key);
  }

  return client.set(key, JSON.stringify(value), { EX: expiresInSeconds });
};

/**
 * Get an item from cache.
 * @param {import('redis').RedisClientType} client - Active Redis client
 * @param {string} key - Cache key
 * @returns {*} Parsed cached value or null
 */
const getItem = async (client, key) => {
  const cached = await client.get(key);

  return typeof cached === 'string' ? JSON.parse(cached) : cached;
};

/**
 * Check if a key exists in cache.
 * @param {import('redis').RedisClientType} client - Active Redis client
 * @param {string} key - Cache key
 * @returns {boolean} True if key exists
 */
const hasItem = async (client, key) => {
  const exists = await client.exists(key);
  return exists === 1;
};

module.exports = {
  closeCache,
  connectCache,

  getItem,
  hasItem,
  removeItem,
  setItem,
};
