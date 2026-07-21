const { default: mongoose } = require("mongoose");
const Product = require("../../model/Product");

const getProducts = async (req, res) => {
  const products = await Product.find();
  console.log(products);
  res
    .status(200)
    .json({ success: true, message: "products found", data: products });
};

const getProduct = async (req, res) => {
  // let product = products.find((p) => p.id === Number(req.params.id));

  let p = await Product.findById(req.params.id);
  if (!p) {
    res.status(404).json({ success: false, message: "404 not found" });
  } else {
    res.json({ success: true, message: "Product found", data: p });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const p = await Product.findByIdAndUpdate(id, req.body, { new: true,runValidators: true });
  if (!p) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
return  res.status(201).json({ success: true, message: "product updated" ,data:p});
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
};
