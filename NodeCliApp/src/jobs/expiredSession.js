const cron = require("node-cron");
const redis = require("../../config/redis");
const User = require("../../model/User");
const expiredSessionDeletion = cron.schedule("0 */1 * * *", async () => {
  try {
    const keys = await redis.keys("session:*");
    console.log("session keys", keys);

    //   await redis.delete(keys);

    const userIds = keys.map((key) => key.split(":")[1]);
    console.log(userIds);

    if (userIds.length === 0) {
      console.log("no user ids found");
      return;
    }
    const existingUserIds = await User.find({
      _id: { $in: userIds },
    })
      .select("_id")
      .lean();

    console.log("user ids", existingUserIds);

    const existingIdSet = new Set(existingUserIds.map((e) => e._id.toString()));

    const nonExistingUsers = keys.filter((k) => {
      const userId = k.split(":")[1];

      return !existingIdSet.has(userId);
    });

    console.log("Expired session keys:", nonExistingUsers);

    // 4. Delete those Redis keys
    if (nonExistingUsers.length > 0) {
      await redis.del(...nonExistingUsers);

      console.log(
        `[cron] Removed ${nonExistingUsers.length} expired session entries`,
      );
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = expiredSessionDeletion;
