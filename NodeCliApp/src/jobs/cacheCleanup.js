const redis = require("../../config/redis");
const cron = require("node-cron");

const cacheCleanupJob = cron.schedule("* * * * *", async () => {
  console.log("[cron] cache cleanup started ");
  try {
    const keys = await redis.keys("products:*");
    console.log(keys.length);
  } catch (error) {
    console.error("[CRON] Cache cleanup failed:", error.message);
  }
});

module.exports=cacheCleanupJob;
