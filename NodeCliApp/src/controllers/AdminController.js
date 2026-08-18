const DailyReport = require("../../model/DailyReport");

const thirtyDaysReport = async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const report = await DailyReport.find({
    date: { $gte: thirtyDaysAgo, $lte: today },
  }).sort({date:-1});

  console.log(report);
  res.status(200).json({ success:true,message:"Reports of 30 days",count:report.length,data:report });
};

module.exports = thirtyDaysReport;
