const Product = require('../../../model/Product');

const getLowStockProducts = async () => {
  const lowStockProducts = await Product.find({
    quantity: { $lt: 5 },
  }).select('_id name quantity');
  return lowStockProducts;
};

module.exports=getLowStockProducts;