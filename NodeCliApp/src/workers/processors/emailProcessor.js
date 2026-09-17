const Order = require('../../../model/Order');

const connection = require('../../../config/bullRedis');
const processEmailJob = async (job) => {
  console.log('<---sending confirmation email--->');
  const order = await Order.findById(job.data.orderId);

  if (!order) {
    throw new Error('Order not found');
  }
  console.log('email sent');
  return {
    success: true,
  };
};

module.exports = { processEmailJob };
