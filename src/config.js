require('dotenv').config();

const {
  NODE_ENV,
  REDIS_TEST_URL = 'use-mock',
  REDIS_URL,
} = process.env;

module.exports = {
  NODE_ENV,
  REDIS_URL: NODE_ENV === 'test' ? REDIS_TEST_URL : REDIS_URL,
};
