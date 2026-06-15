const {
  closeCache,
  connectCache,

  getItem,
  hasItem,
  removeItem,
  setItem,
} = require('./redis');

/* eslint-disable sort-keys */
module.exports = () => ({
  client: null,
  state: null,
  closeCache: async () => closeCache(this.client),
  connectCache: async (url) => {
    this.client = await connectCache(url);

    return this.client;
  },

  getItem: async (key) => getItem(this.client, key),
  hasItem: async (key) => hasItem(this.client, key),
  removeItem: async (key) => removeItem(this.client, key),
  setItem: async (key, value) => setItem(this.client, key, value),
});
