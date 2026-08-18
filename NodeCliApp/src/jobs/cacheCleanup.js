const redis = require("../../config/redis");
const cron = require("node-cron");
const Product = require("../../model/Product");
const preventOverlap = require("./utils/preventOverlap");


const runCacheCleanupJob=preventOverlap("cacheCleanup Job",async () => {

  
    const keys = await redis.keys("product:*");
    // console.log("Product cache keys:", keys);

    if (keys.length === 0) {
      console.log("No product cache entries found");
      return;
    }

    const productIds = keys.map((key) => key.split("/").pop());
    console.log(productIds);

    const existingProducts = await Product.find({
      _id: { $in: productIds },
    }).select("_id");

    // console.log('Existing Products',existingProducts);

    const existingIds = new Set(
      existingProducts.map((product) => product._id.toString()),
    );
    // console.log("existing ids", existingIds);
    const orphanedKeys = keys.filter((key) => {
      const productId = key.split("/").pop();

      return !existingIds.has(productId);
    });
    console.log(" orphaned ids", orphanedKeys);

    // console.log(existingProducts);

    if (orphanedKeys.length > 0) {
      await redis.del(...orphanedKeys);

      console.log(
        `[cron] Removed ${orphanedKeys.length} orphaned cache entries`,
      );
    }
 
})


const cacheCleanupJob = cron.schedule("* * * * *", runCacheCleanupJob);

// const demoData = async () => {
//   try {
//     await redis.setex(
//       "product:/api/products/507f1f77bcf86cd799439011",
//       60,
//       JSON.stringify({
//         name: "Demo Product",
//       }),
//     );

//     console.log("demo data inserted");
//   } catch (error) {
//     console.error("Demo insert failed:", error.message);
//   }
// };

// demoData();
module.exports = cacheCleanupJob;
