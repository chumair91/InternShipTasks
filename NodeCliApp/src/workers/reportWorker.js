const { Worker } = require('bullmq');
const connection = require('../../config/bullRedis');

const failedjobQueue = require('../queues/failedjobQueue');
const generateDailyReport = require('../jobs/utils/generateDailyReport');

const reportWorker = new Worker(
  'report',
  generateDailyReport,
  { connection, concurrency: 1, }
);

reportWorker.on("completed", (job) => {
  console.log(`////report job ${job.id} completed////`);
});

reportWorker.on("failed", async (job, error) => {
  if (error?.message?.startsWith("child bull:")) {
    return;
  }
  console.log(`report job ${job?.id} failed: ${error.message}`);
  await failedjobQueue.add("save-failed-job", {
    queue: "report",
    jobId: job.id,
    jobName: job.name,
    data: job.data,
    error: error.message,
    stack: error.stack
  });
});

module.exports = reportWorker;
