const cacheCleanupJob = require("./cacheCleanup");
const dailySalesReport = require("./DailySalesReport");
const expiredSessionDeletion = require("./expiredSession");
const lowStockAlert = require("./lowStockAlert");

const startJobs = () => {
  cacheCleanupJob.start();
  expiredSessionDeletion.start();
  dailySalesReport.start();
  lowStockAlert.start();
  console.log("[CRON] jos started");
};

module.exports = startJobs;
