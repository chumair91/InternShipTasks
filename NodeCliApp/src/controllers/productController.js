const { default: mongoose } = require("mongoose");
const Product = require("../../model/Product");
const QueryBuilder = require("../utils/QueryBuilder");
const Review = require("../../model/Review");
const redis = require("../../config/redis");

// const getProducts = async (req, res) => {
//   const products = await Product.find({category:'electronics'}).explain("executionStats");
//   console.log(products.executionStats.totalDocsExamined);
//   res
//     .status(200)
//     .json({ success: true, message: "products found", data: products });
// };

const giveReview = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  console.log(id, body);
  Review.create({
    product: id,
    user: req.user.id,
    rating: body.rating,
    comment: body.comment,
  });
  return res.status(201).json({ success: true, message: "Review Posted" });
};

const aggregateProduct = async (req, res) => {
  const [summary] = await Product.aggregate([
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              totalValue: { $sum: "$price" },
              avgPrice: { $avg: "$price" },
            },
          },
        ],
        byCategory: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
              avgPrice: { $avg: "$price" },
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              count: 1,
              avgPrice: 1,
            },
          },
        ],

        outOfStock: [
          {
            $match: {
              quantity: 0,
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: "product analytics found",
    data: summary || { totalProducts: 0 },
  });
};

const getReview = async (req, res) => {
  const { id } = req.params;
  console.log("printing id", id);

  const review = await Review.find({ product: id }).populate(
    "user",
    "name avatar fullAddress",
  );

  if (review) {
    return res
      .status(200)
      .json({ success: true, message: "review found", data: review });
  }
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  console.log(review.user);

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "you cant delete this comment" });
  }
  const deletedReview = await Review.findByIdAndDelete(req.params.id);

  //
  return res.status(200).json({
    success: true,
    message: "review found and deleted",
    data: deletedReview,
  });
};

const getProducts = async (req, res) => {
  // const products = await Product.find();


  const builder = new QueryBuilder(Product.find(), req.query);
  let p = await builder.filter().search().sort().paginate().query;
  // console.log(p);
  if (p.length !== 0) {
   
    return res
      .status(200)
      .json({ success: true, message: "products found", data: p });
  }
  return res.status(400).json({ success: false, message: "No products Found" });
};

const getProduct = async (req, res) => {
  // let product = products.find((p) => p.id === Number(req.params.id));
  

  let p = await Product.findById(req.params.id);
  if (!p) {
    return res.status(404).json({
      success: false,
      message: "404 not found",
    });
  } else {
  
    return res.status(200).json({
      success: true,
      message: "Product found",
      data: p,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const cachedkey = `product:${req.params.id}`;
  const p = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!p) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await redis.del(cachedkey);
  const keys=await redis.keys("products:*");
  if (keys.length>0) {
    await redis.del(...keys)
  }
  await redis.del("products");
  return res
    .status(201)
    .json({ success: true, message: "product updated", data: p });
};

const createProduct = async (req, res) => {
  const body = req.body;
  // let p = products[products.length - 1];
  // const newId = p.id + 1;

  // console.log(newId);
  // const newProduct = { id: newId, ...body };
  // products.push(newProduct);
  // console.log(body);

  let p = await Product.create(body);
  res
    .status(201)
    .json({ success: true, message: `product added with id: ${p._id} ` });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  // const intId = Number(id);
  // const index = products.findIndex((data) => data.id === intId);

  const p = await Product.findByIdAndDelete(id);
  console.log(p);
  if (!p) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  return res.status(200).json({ success: true, message: "product deleted", p });
};

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  giveReview,
  getReview,
  deleteReview,
  aggregateProduct,
};
