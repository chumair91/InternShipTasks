const { Queue } = require("bullmq");
const connection = require("../../config/bullRedis");
const emailQueue = new Queue("email", { connection });
module.exports = emailQueue;