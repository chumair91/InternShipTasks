const config = require('../../config');
const stripe = require('../../config/stripe');
const Order = require('../../model/Order');
const User = require('../../model/User');
const { emitToUserRoom } = require('../socketEvent');

const webhook = async (req, res) => {
  console.log('----😍😍😍😍webhook received-----');
  
  const signature = req.headers['stripe-signature'];
  const endpointSecret = config.stripWebhookSecret;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (error) {
    return res.status(400).send(error.message);
  }
  //   const subscription=event.data.object;

  //   console.log(JSON.stringify(event.data.object, null, 2));

  switch (event.type) {
    case 'customer.subscription.updated':
      try {
        const subscription = event.data.object;
        const user = await User.findOne({
          stripeCustomerId: subscription.customer,
        });
        if (!user) break;

        let plan = 'free';
        const priceId = subscription.items.data[0].price.id;
        if (priceId === config.stripeBasicPlan) plan = 'basic';
        if (priceId === config.stripeProPlan) plan = 'pro';
        console.log(subscription.id);

        user.subscription.plan = plan;
        user.subscription.stripeSubscriptionId = subscription.id;
        user.subscription.status = subscription.status;
        user.subscription.currentPeriodEnd = new Date(
          subscription.items.data[0].current_period_end * 1000
        );

        await user.save();
        console.log('Subscription synced.');
      } catch (err) {
        console.error('Failed to sync subscription:', err);
        return res.status(500).send('Webhook handler failed');
      }
      break;

    case 'customer.subscription.deleted':
      console.log('subscription deleted');
      break;
    case 'invoice.payment_failed':
      const invoice = event.data.object;
      const user = await User.findOne({
        stripeCustomerId: invoice.customer,
      });
      if (!user) {
        console.log('User not found for Stripe customer:', invoice.customer);
        break;
      }
      user.paymentFailed = true;
      user.paymentFailureReason =
        invoice.last_finalization_error?.message || 'Payment failed';

      await user.save();

      console.log('Payment failure recorded for:', user.email);
      console.log('subscription deleted');
      break;

    case 'invoice.paid': {
      const invoice = event.data.object;

      const user = await User.findOne({
        stripeCustomerId: invoice.customer,
      });

      if (user) {
        user.paymentFailed = false;
        user.paymentFailureReason = null;
        await user.save();
      }

      break;
    }
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('Product checkout completed:', session.id);
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        console.log('No orderId found in Stripe session metadata');
        break;
      }
      const order = await Order.findById(orderId);

      if (!order) {
        console.log('Order not found:', orderId);
        break;
      }
      if (order.paymentStatus === 'paid') {
        console.log('Order already marked as paid:', orderId);
        break;
      }
      order.paymentStatus = 'paid';
      order.status = 'payment-completed';
      order.paidAt = new Date();

      await order.save();
      const userId = (order.user._id || order.user).toString();
      emitToUserRoom(userId, 'payment:confirmed', {
        orderId: order._id.toString(),
        status: 'paid',
        message: 'Payment successful',
      });
      console.log('Order payment confirmed:', orderId);

      break;
    }

    default:
      console.log(event.type);
      break;
  }

  res.json({ received: true });
};

module.exports = { webhook };
