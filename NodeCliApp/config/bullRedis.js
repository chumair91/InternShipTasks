const Redis = require("ioredis");
const config = require(".");

const bullRedis = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  username: config.redisUsername,
  password: config.redisDefUserPassword,

  maxRetriesPerRequest: null,
});

module.exports = bullRedis;
