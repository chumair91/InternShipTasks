const cacheCleanupJob = require("./cacheCleanup");

const startJobs = () => {
  cacheCleanupJob.start();

  console.log("[CRON] jos started");
};


module.exports=startJobs