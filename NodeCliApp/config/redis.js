const Redis = require("ioredis");
const config = require(".");
const redis = new Redis({
  host: config.redisHost, // e.g., redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com
  port: config.redisPort,
  username: config.redisUsername, // Optional, depends on provider
  password: config.redisDefUserPassword,
});
module.exports = redis;
