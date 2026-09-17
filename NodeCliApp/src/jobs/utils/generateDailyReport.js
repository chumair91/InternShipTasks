const Order = require('../../../model/Order');
const User = require('../../../model/User');
const DailyReport = require('../../../model/DailyReport');

const generateDailyReport = async (job = null) => {
  if (job) await job.updateProgress(0);
  const today = new Date();

  const yesterdayStartOfDay = new Date(today);
  yesterdayStartOfDay.setDate(today.getDate() - 1);
  yesterdayStartOfDay.setHours(0, 0, 0, 0);
  const yesterdayEndOfDay = new Date(today);
  yesterdayEndOfDay.setDate(today.getDate() - 1);
  yesterdayEndOfDay.setHours(23, 59, 59, 999);

  const totalOrders = await Order.countDocuments({
    createdAt: {
      $gte: yesterdayStartOfDay,
      $lte: yesterdayEndOfDay,
    },
    status: 'completed',
  });
  if (job) await job.updateProgress(25);
  //   console.log("total orders", totalOrders);

  const revenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yesterdayStartOfDay,
          $lte: yesterdayEndOfDay,
        },
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);
   if (job) await job.updateProgress(50);

  //   console.log("total revenue", revenue);

  const newUsers = await User.countDocuments({
    createdAt: {
      $gte: yesterdayStartOfDay,
      $lte: yesterdayEndOfDay,
    },
  });
   if (job) await job.updateProgress(75);

  //   console.log("new Users", newUsers);

  const report = await DailyReport.create({
    date: yesterdayStartOfDay,
    totalOrders,
    totalRevenue: revenue[0]?.totalRevenue || 0,
    newUsers,
  });

  console.log('[cron] Daily report saved');
  if (job) await job.updateProgress(100);
  return report;
};

module.exports = generateDailyReport;
