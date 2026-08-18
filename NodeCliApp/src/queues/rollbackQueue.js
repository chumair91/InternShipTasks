const { Queue } = require("bullmq");
const connection = require("../../config/bullRedis");

const rollbackQueue= new Queue("rollback", {
  connection,
});
module.exports =rollbackQueue;