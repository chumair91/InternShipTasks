const { default: mongoose } = require("mongoose");

const DailyReport = mongoose.Schema(
  {
    date: Date,
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);


module.exports=mongoose.model('DailyReport',DailyReport);