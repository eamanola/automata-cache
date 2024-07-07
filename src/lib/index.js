const {
  initCache,
  connectCache,
  closeCache,

  getItem,
  setItem,
  removeItem,
} = require('./redis');

module.exports = {
  closeCache,
  connectCache,
  getItem,
  initCache,
  removeItem,
  setItem,
};
