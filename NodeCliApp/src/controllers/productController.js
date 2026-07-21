const products = require("../../Products");

const getProducts = (req, res) => {
  res.json(products);
};

const getProduct = (req, res) => {
  let product = products.find((p) => p.id === Number(req.params.id));
  if (product === undefined) {
    res.status(404).json({ success: false, message: "404 not found" });
  } else {
    res.json({ success: true, message: "Products found", product });
  }
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const intId = Number(id);
  const newP = req.body;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === intId) {
      products[i] = { id: intId, ...newP };
      res.status(201).json({ success: true, message: "product updated" });
    }
  }
  res.status(404).json({ success: false, message: "could not find product" });
};

const createProduct = (req, res) => {
  const body = req.body;
  let p = products[products.length - 1];
  const newId = p.id + 1;

  // console.log(newId);
  const newProduct = { id: newId, ...body };
  products.push(newProduct);
  res.status(201).json({ success:true,message: "product added" });
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  const intId = Number(id);
  const index = products.findIndex((data) => data.id === intId);

  if (index !== -1) {
    products.splice(index, 1);
    return res.status(200).json({ success:true,message: "product deleted",  products });
  }

  return res
    .status(404)
    .json({ success:false,message: "could not delete"  });
};

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
};
