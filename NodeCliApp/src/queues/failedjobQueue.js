const { Queue } = require("bullmq");
const connection=require('../../config/bullRedis')
const failedjobQueue=new Queue('failedJobs',{connection});

module.exports=failedjobQueue;