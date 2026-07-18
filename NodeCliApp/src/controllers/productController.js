const products = require("../../Products");

const getProducts = (req, res) => {
  res.json(products);
};

const getProduct = (req, res) => {
  let product = products.find((p) => p.id === Number(req.params.id));
  if (product === undefined) {
    res.json({ message: "404 not found" });
  } else {
    res.json(product);
  }
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const intId = Number(id);
  const newP = req.body;

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === intId) {
      products[i] = { id: intId, ...newP };
      res.json({ message: "product updated", status: 201 });
    }
  }
  res.json({ message: "could not find product", status: 404 });
};

const createProduct=(req, res) => {
  const body = req.body;
  let p = products[products.length - 1];
  const newId = p.id + 1;

  console.log(newId);
  const newProduct = { id: newId, ...body };
  products.push(newProduct);
  res.json({ message: "product added", status: 201 });
}

const deleteProduct=(req, res) => {
  const { id } = req.params;
  const intId = Number(id);
  const index = products.findIndex((data) => data.id === intId);

  if (index !== -1) {
    products.splice(index, 1);
    return res.json({ message: "product deleted", status: 200, products });
  }

  return res
    .status(404)
    .json({ message: "could not delete", status: 404, products });
}

module.exports = { getProducts, getProduct ,updateProduct,createProduct,deleteProduct};
