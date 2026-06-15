/* eslint-disable sort-keys */
module.exports = ({ AUTOMATA_CACHE = 'redis' }) => {
  let driver;

  console.log('mocking cache');

  switch (AUTOMATA_CACHE) {
    case 'redis':
      driver = require('redis');
      break;
    case 'use-mock':
      driver = require('./mock')();
      break;
    default:
      throw new Error('AUTOMATA_CACHE must be one of: "redis", "use-mock');
  }

  return ({
    client: null,
    state: null,
    closeCache: async () => driver.closeCache(this.client),
    connectCache: async (url) => {
      this.client = await driver.connectCache(url);
    },

    getItem: async (key) => driver.getItem(this.client, key),
    hasItem: async (key) => driver.hasItem(this.client, key),
    removeItem: async (key) => driver.removeItem(this.client, key),
    setItem: async (key, value) => driver.setItem(this.client, key, value),
  });
};
