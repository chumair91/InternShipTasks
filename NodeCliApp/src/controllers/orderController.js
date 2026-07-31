const { default: mongoose } = require("mongoose");
const Product = require("../../model/Product");
const Order = require("../../model/Order");


const placeOrder=async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let order;
    await session.withTransaction(async () => {
      let total = 0;
      const user = req.user._id;
      let orderItems = [];
      for (const cartItem of req.body.items) {
        let product = await Product.findById(cartItem.product).session(session);
        if (!product) {
          throw new Error("Product not found");
        }
        if (product.quantity < cartItem.quantity) {
          throw new Error(`${product.name} is out of stock`);
        }
        if (product.inStock && product.quantity >= cartItem.quantity) {
          total += product.price * cartItem.quantity;
          product.quantity -= cartItem.quantity;
          if (product.quantity === 0) {
            product.inStock = false;
          }
          orderItems.push({
            product: product._id,
            quantity: cartItem.quantity,
            price: product.price,
          });
          await product.save({ session });
        }
      }
      [order] = await Order.create(
        [
          {
            user: user,
            items: orderItems,
            total: total,
          },
        ],
        { session },
      );
      console.log(order);
    });

    res.status(201).json({
      success: true,
      order,
    });
  } finally {
    session.endSession();
  }
};

module.exports=placeOrder;