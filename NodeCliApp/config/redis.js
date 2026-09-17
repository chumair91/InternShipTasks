const Redis = require("ioredis");
const config = require(".");
const redis = new Redis({
  host: config.redisHost, // e.g., redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com
  port: config.redisPort,
  username: config.redisUsername, 
  password: config.redisDefUserPassword,
   connectTimeout: 10000,
  maxRetriesPerRequest: 3,
  keepAlive: 10000,     
  retryStrategy: (times) => {
   
    return Math.min(times * 500, 3000);
  },
});


redis.on("connect", () => console.log("Redis: connecting..."));
redis.on("ready", () => console.log("Redis: connected and ready"));
redis.on("error", (err) => console.error("Redis error:", err));
module.exports = redis;
