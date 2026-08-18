const { Queue } = require("bullmq");
const connection = require("../../config/bullRedis");

const paymentQueue = new Queue("payment", { connection });
module.exports = paymentQueue;