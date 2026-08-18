const cron = require("node-cron");


const preventOverlap = require("./utils/preventOverlap");
const reportQueue = require("../queues/reportQueue");

const runDailySalesReport=preventOverlap("dailySalesReport job",async () => {
   await reportQueue.add('generate-report',{},{
    attempts:3,
    backoff:{
      type:'exponential',
      delay:5000,
    }
   });
   console.log('report job added');
   
   
  })

const dailySalesReport = cron.schedule("0 0 * * *", runDailySalesReport);

module.exports = dailySalesReport;
