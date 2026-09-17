const Redis = require('ioredis');
const config = require('.');

const pubClient = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  username: config.redisUsername,
  password: config.redisDefUserPassword,

  maxRetriesPerRequest: null,
});
const subClient = pubClient.duplicate();
pubClient.on("ready", () => {
  console.log("Socket Redis publisher ready");
});

subClient.on("ready", () => {
  console.log("Socket Redis subscriber ready");
});

pubClient.on("error", (err) => {
  console.error("Socket Redis publisher error:", err);
});

subClient.on("error", (err) => {
  console.error("Socket Redis subscriber error:", err);
});

module.exports = {
  pubClient,
  subClient,
};