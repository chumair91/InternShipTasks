const express = require("express");
const products = require("../Products");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  let product = products.find((p) => p.id === Number(req.params.id));
  if (product === undefined) {
    res.json({ message: "404 not found" });
  } else {
    res.json(product);
  }
});

router.put("/:id", (req, res) => {
  console.log("Products Before Edit");
  console.log(products);

  const { id } = req.params;
  const intId = Number(id);
  const newP = req.body;
  console.log(newP);

  console.log(id);

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === intId) {
      products[i] = { id: intId, ...newP };
    }
  }
  console.log("Products after Edit");
  console.log(products);
  res.json({ message: "product updated", status: 201 });
});

router.post("/", (req, res) => {
  const body = req.body;
  let p = products[products.length - 1];
  const newId = p.id + 1;

  console.log(newId);
  const newProduct = { id: newId, ...body };
  products.push(newProduct);
  res.json({ message: "product added", status: 201 });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const intId = Number(id);
  products.forEach((data, index) => {
    if (data.id === intId) {
      products.splice(index, 1);
      res.json({message:"product deleted",status:200,products})
    }
  });

   
  res.json({message:"could not delete",status:404,products})
});
module.exports = router;
