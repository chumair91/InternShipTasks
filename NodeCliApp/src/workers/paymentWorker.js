const { Worker, UnrecoverableError } = require('bullmq');
const connection = require('../../config/bullRedis');
const Order = require('../../model/Order');
const failedjobQueue = require('../queues/failedjobQueue');
const stripe = require('../../config/stripe');
const { emitToUserRoom } = require('../socketEvent')
const paymentWorker = new Worker(
  'payment',
  async (job) => {
    console.log('<---running payment worker--->');

    const order = await Order.findById(job.data.orderId)
      .populate({
        path: 'items.product',
        select: 'name',
      })
      .populate({
        path: 'user',
        select: '_id email',
      });

    if (!order) {
      throw new UnrecoverableError('Order not found');
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.user.email,
      success_url:
        'http://localhost:5173/order-payment-success?session_id={CHECKOUT_SESSION_ID}',

      cancel_url: 'http://localhost:5173/order-payment-cancel',
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.checkoutUrl = session.url;
    order.stripeSessionId = session.id;
    await order.save();
     emitToUserRoom(order.user._id.toString(),'payment:ready',{
      orderId:order._id.toString(),
      checkoutUrl:session.url,
     })

    return { checkoutUrl: session.url };
  },
  { connection }
);

paymentWorker.on('completed', (job) => {
  console.log(`////payment job ${job.id} completed////`);
});

paymentWorker.on('failed', async (job, error) => {
  if (error?.message?.startsWith('child bull:')) {
    return;
  }
  console.log(`payment job ${job?.id} failed: ${error.message}`);
  await failedjobQueue.add('save-failed-job', {
    queue: 'payment',
    jobId: job.id,
    jobName: job.name,
    data: job.data,
    error: error.message,
    stack: error.stack,
  });
});

module.exports = paymentWorker;
