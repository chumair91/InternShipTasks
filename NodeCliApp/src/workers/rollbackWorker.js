const { Worker } = require('bullmq');
const Product = require('../../model/Product');
const mongoose = require('mongoose');
const connection = require('../../config/bullRedis');
const Order = require('../../model/Order');
const failedjobQueue = require('../queues/failedjobQueue');

const rollbackWorker = new Worker(
  'rollback',
  async (job) => {
    console.log('<---Running rollback😥😥😥--->');

    const { orderId, reason } = job.data;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const order = await Order.findById(orderId).session(session);
        if (!order) return;

        if (
          order.status === 'stock-validated' ||
          order.status === 'payment-completed'
        ) {
          for (const item of order.items) {
            const product = await Product.findById(item.product).session(
              session
            );

            if (!product) continue;

            product.quantity += item.quantity;
            product.inStock = true;

            await product.save({ session });
          }
        }
        await Order.deleteOne({ _id: orderId }).session(session);
      });
      console.log('Rollback completed');
      console.log('Reason:', reason);
    } finally {
      await session.endSession();
    }
  },
  { connection }
);

rollbackWorker.on('completed', () => {
  console.log('Rollback successful');
});

rollbackWorker.on('failed', async (job, err) => {
  if (err?.message?.startsWith("child bull:")) {
    return;
  }
  console.log('Rollback failed:', err.message);
  await failedjobQueue.add("save-failed-job", {
    queue: "rollback",
    jobId: job?.id,
    jobName: job?.name,
    data: job?.data,
    error: err.message,
    stack: err.stack
  });
});

module.exports = rollbackWorker;
