const { Queue } = require("bullmq");
const connection = require("../../config/bullRedis");

const orderQueue = new Queue("order", { connection });
module.exports = orderQueue;