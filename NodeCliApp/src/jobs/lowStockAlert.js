const cron = require("node-cron");
const Product = require("../../model/Product");
const preventOverlap = require("./utils/preventOverlap");

const runlowStockAlert=preventOverlap("LowStockAlert job",async () => {
 
 
 
 
    const lowStockProducts = await Product.find({
      quantity: { $lt: 5 },
    }).select("_id name quantity");
   
    
    if (lowStockProducts.length === 0) {
      console.log("[cron] No low-stock products");
      return;
    }

    lowStockProducts.forEach((product) => {
      console.warn(
        `[LOW Stock]  ${product.name} - only ${product.quantity} left`,
      );
    });
 
})


const lowStockAlert = cron.schedule("0 */6 * * *", runlowStockAlert);



module.exports = lowStockAlert;
