const { Worker } = require("bullmq");
const connection = require("../../config/bullRedis");
const Order = require("../../model/Order");
const rollbackQueue = require("../queues/rollbackQueue");
const failedjobQueue = require("../queues/failedjobQueue");
const orderWorker = new Worker(
  "order",
  async (job) => {
    console.log("<---Running parent order worker--->");
    console.log(job.name);
    const order=await Order.findById(job.data.orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = "processed";

    await order.save();

    console.log("Order processed:", order._id);

    return { success: true,orderId:order._id };
  },
  { connection },
);

orderWorker.on("completed", (job) => {
  console.log(`////order job ${job.id} completed////`);
});

orderWorker.on("failed", async (job, error) => {
  if (error?.message?.startsWith("child bull:")) {
    return;
  }
  console.log(`order job ${job?.id} failed: ${error.message}`);
  await rollbackQueue.add('rollback-order',{orderId:job.data.orderId,reason:error.message});
  await failedjobQueue.add("save-failed-job",{
    queue:"order",
    jobId:job.id,
    jobName:job.name,
    data:job.data,
    error:error.message,
    stack:error.stack
  });
});

module.exports = orderWorker;