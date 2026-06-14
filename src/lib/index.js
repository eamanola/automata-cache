const {
  createCacheClient,

  getItem,
  setItem,
  removeItem,
} = require('./redis');

module.exports = {
  createCacheClient,
  getItem,
  removeItem,
  setItem,
};