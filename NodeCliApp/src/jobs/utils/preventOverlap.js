const preventOverlap = (jobName, jobFunction) => {
  let isRunning = false;

  return async () => {
    if (isRunning) {
      console.log(jobName, "already running ,skipping");
      return;
    }
    isRunning = true;
    try {
      await jobFunction();
    } catch (error) {
      console.error(`[cron] ${jobName} failed`, error.message);
    } finally {
      isRunning = false;
      console.log(`[cron] ${jobName} finished`);
    }
  };
};

module.exports=preventOverlap;