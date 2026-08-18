const { Worker, UnrecoverableError } = require("bullmq");
const connection = require("../../config/bullRedis");
const Order = require("../../model/Order");
const { default: mongoose } = require("mongoose");
const Product = require("../../model/Product");
const failedjobQueue = require("../queues/failedjobQueue");

const stockWorker = new Worker(
  "stock",
  async (job) => {
    console.log("<---running stock worker--->");
    console.log("processing job", job.id);
    console.log(" job name", job.name);
    console.log(" job data", job.data);

    const order = await Order.findById(job.data.orderId);
    if (!order) {
      throw new UnrecoverableError("Order not found");
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        let total = 0;
        for (const item of order.items) {
          const product = await Product.findById(item.product).session(session);
          if (!product) {
            throw new UnrecoverableError("Product not found");
          }
          if (product.quantity < item.quantity) {
            throw new UnrecoverableError(`${product.name} is out of stock`);
          }
          product.quantity -= item.quantity;
          if (product.quantity === 0) {
            product.inStock = false;
          }
          await product.save({ session });

          total += product.price * item.quantity;
          item.price = product.price;
        }
        order.total = total;
        order.status = "stock-validated";
        await order.save({ session });
      });

    //   console.log("///stock validation completed///");
      return { success: true, orderId: order._id };
    } finally {
      await session.endSession();
    }
  },
  { connection },
);

stockWorker.on("completed", (job) => {
  console.log(`////stock job ${job.id} completed////`);
});

stockWorker.on("failed", async (job, error) => {
  if (error?.message?.startsWith("child bull:")) {
    return;
  }
  console.log(`stock job ${job?.id} failed: ${error.message}`);
  await failedjobQueue.add("save-failed-job", {
    queue: "stock",
    jobId: job.id,
    jobName: job.name,
    data: job.data,
    error: error.message,
    stack: error.stack
  });
});

module.exports = stockWorker;
