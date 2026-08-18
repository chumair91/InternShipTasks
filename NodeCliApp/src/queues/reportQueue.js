const { Queue } = require("bullmq");
const connection=require('../../config/bullRedis')
const reportQueue=new Queue('report',{connection});

module.exports=reportQueue;