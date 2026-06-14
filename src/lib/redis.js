const { createClient } = require('redis');

const { REDIS_URL } = require('../config');

/**
 * Create a new Redis client instance.
 * The caller is responsible for managing the client lifecycle (connect, disconnect).
 *
 * @param {string} [url=REDIS_URL] - Redis connection URL
 * @returns {import('redis').RedisClientType} A new Redis client
 */
const createCacheClient = (url = REDIS_URL) => {
  return createClient({ url });
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

/**
 * Get an item from cache, or set it using the provided factory function if missing (cache-aside pattern).
 * @param {import('redis').RedisClientType} client - Active Redis client
 * @param {string} key - Cache key
 * @param {Function} factory - Async function that produces the value to cache
 * @param {number} [expiresInSeconds=86400] - TTL in seconds (default 24h)
 * @returns {*} Cached or freshly computed value
 */
const getOrSet = async (client, key, factory, expiresInSeconds = 60 * 60 * 24) => {
  const cached = await getItem(client, key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  const value = await factory();
  await setItem(client, key, value, expiresInSeconds);
  return value;
};

module.exports = {
  createCacheClient,
  getItem,
  getOrSet,
  hasItem,
  removeItem,
  setItem,
};