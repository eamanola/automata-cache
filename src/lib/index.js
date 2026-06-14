const {
  createCacheClient,

  getItem,
  getOrSet,
  hasItem,
  removeItem,
  setItem,
} = require('./redis');

module.exports = {
  createCacheClient,
  getItem,
  getOrSet,
  hasItem,
  removeItem,
  setItem,
};