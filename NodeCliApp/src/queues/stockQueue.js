const { Queue } = require("bullmq");
const connection = require("../../config/bullRedis");
const stockQueue = new Queue("stock", { connection });
module.exports = stockQueue;
