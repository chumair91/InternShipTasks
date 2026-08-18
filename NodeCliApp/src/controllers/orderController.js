const { default: mongoose } = require("mongoose");
const Product = require("../../model/Product");
const Order = require("../../model/Order");
const flowProducer = require("../flow/orderFlow");

// const placeOrder = async (req, res) => {
//   const session = await mongoose.startSession();
//   try {
//     let order;
//     await session.withTransaction(async () => {
//       let total = 0;
//       const user = req.user._id;
//       let orderItems = [];
//       for (const cartItem of req.body.items) {
//         let product = await Product.findById(cartItem.product).session(session);
//         if (!product) {
//           throw new Error("Product not found");
//         }
//         if (product.quantity < cartItem.quantity) {
//           throw new Error(`${product.name} is out of stock`);
//         }
//         if (product.inStock && product.quantity >= cartItem.quantity) {
//           total += product.price * cartItem.quantity;
//           product.quantity -= cartItem.quantity;
//           if (product.quantity === 0) {
//             product.inStock = false;
//           }
//           orderItems.push({
//             product: product._id,
//             quantity: cartItem.quantity,
//             price: product.price,
//           });
//           await product.save({ session });
//         }
//       }
//       [order] = await Order.create(
//         [
//           {
//             user: user,
//             items: orderItems,
//             total: total,
//           },
//         ],
//         { session },
//       );
//       await flowProducer.add({
//         name: "process-order",
//         queueName: "order",
//         data: {
//           orderId: order._id,
//         },

//         children: [
//           {
//             name: "validate-stock",
//             queueName: "stock",
//             data: {
//               orderId: order._id,
//             },
//           },
//           {
//             name:'charge-payment',
//             queueName:'payment',
//             data:{
//               orderId:order._id,
//             }
//           },
//           {
//             name:'send-email',
//             queueName:'email',
//             data:{
//               orderId:order._id,
//             }
//           }
//         ],
//       });
//       console.log(order);
//     });

//     res.status(201).json({
//       success: true,
//       order,
//     });
//   } finally {
//     session.endSession();
//   }
// };

const placeOrder = async (req, res) => {
  const order = await Order.create({
    user: req.user._id,
    items: req.body.items,
    total: 0,
  });

  await flowProducer.add({
    name: "process-order",
    queueName: "order",
    data: {
      orderId: order._id.toString(),
    },
   

    children: [
      {
        name: "send-email",
        queueName: "email",
        data: {
          orderId: order._id.toString(),
        },
        opts: {
          attempts:5,
          backoff:{
            type:'exponential',
            delay:3000,
          },
          failParentOnFailure: true,
        },

        children: [
          {
            name: "charge-payment",
            queueName: "payment",
            data: {
              orderId: order._id.toString(),
            },
            opts: {
              attempts:3,
              backoff:{
                type:'exponential',
                delay:3000,
              },
              failParentOnFailure: true,
            },

            children: [
              {
                name: "validate-stock",
                queueName: "stock",
                data: {
                  orderId: order._id.toString(),
                },
                opts: {
                  attempts:3,
              backoff:{
                type:'exponential',
                delay:3000,
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

  res.status(202).json({
    success: true,
    message: "Order created. Processing has started.",
    orderId:order._id.toString(),
  });
};

module.exports = placeOrder;
