const { Worker } = require("bullmq");

const connection=require('../../config/bullRedis');
const Order = require("../../model/Order");
const failedjobQueue = require("../queues/failedjobQueue");
const { processEmailJob } = require("./processors/emailProcessor");

const emailWorker=new Worker("email",processEmailJob,{connection,concurrency:5});


emailWorker.on("completed",(job)=>{
    console.log(`job ${job.id} completed`);
})

emailWorker.on("failed", async (job, error) => {
    if (error?.message?.startsWith("child bull:")) {
        return;
    }
    console.log(`email job ${job?.id} failed: ${error.message}`);
    await failedjobQueue.add("save-failed-job", {
      queue: "email",
      jobId: job.id,
      jobName: job.name,
      data: job.data,
      error: error.message,
      stack: error.stack
    });
})


module.exports=emailWorker;