const mongoose = require('mongoose');

const Product = require('../../model/Product');
const Order = require('../../model/Order');
const flowProducer = require('../flow/orderFlow');
const { emitToUserRoom } = require('../socketEvent');

const placeOrder = async (req, res) => {
  // console.log(req.body.items);

  const order = await Order.create({
    user: req.user._id,
    items: req.body.items,
    total: 0,
  });

  await flowProducer.add({
    name: 'process-order',
    queueName: 'order',
    data: {
      orderId: order._id.toString(),
    },

    children: [
      {
        name: 'send-email',
        queueName: 'email',
        data: {
          orderId: order._id.toString(),
        },
        opts: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          failParentOnFailure: true,
        },

        children: [
          {
            name: 'charge-payment',
            queueName: 'payment',
            data: {
              orderId: order._id.toString(),
            },
            opts: {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 3000,
              },
              failParentOnFailure: true,
            },

            children: [
              {
                name: 'validate-stock',
                queueName: 'stock',
                data: {
                  orderId: order._id.toString(),
                },
                opts: {
                  attempts: 3,
                  backoff: {
                    type: 'exponential',
                    delay: 3000,
                  },
                  failParentOnFailure: true,
                },
              },
            ],
          },
        ],
      },
    ],
  });
  // console.log(order);

  emitToUserRoom(req.user._id.toString(), 'order:created', {
    orderId: order._id.toString(),
    message: 'Your order has been created',
    status: 'processing',
  });

  res.status(202).json({
    success: true,
    message: 'Order created. Processing has started.',
    orderId: order._id.toString(),
  });
};

const orderStatus = async (req, res) => {
  const { identifier } = req.params;

  let order;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    order = await Order.findOne({
      _id: identifier,
      user: req.user._id,
    });
  } else {
    order = await Order.findOne({
      stripeSessionId: identifier,
      user: req.user._id,
    });
  }

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  res.status(200).json({
    success: true,
    orderId: order._id,
    paymentStatus: order.paymentStatus,
    status: order.status,
    checkoutUrl: order.checkoutUrl,
  });
};

module.exports = { placeOrder, orderStatus };
