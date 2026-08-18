const { Worker } = require("bullmq");
const connection=require('../../config/bullRedis');
const FailedJobs = require("../../model/FailedJobs");
const failedJobWorker=new Worker('failedJobs',async (job)=>{
    console.log('saving failed job...');
    await FailedJobs.create(job.data);
    console.log('failed job saved ');
},{connection,concurrency:2});

failedJobWorker.on('failed', (job, error) => {
    console.error(`failedJobWorker error for job ${job?.id}: ${error.message}`);
});

module.exports=failedJobWorker;