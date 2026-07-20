const express = require("express");
const products = require("../../Products");
const { validateId } = require("../middleware/ValidateId");
const { getProducts, getProduct, updateProduct, createProduct, deleteProduct } = require("../controllers/productController");
const protect = require("../middleware/authProvider");

const router = express.Router();

router.get("/", getProducts);

router.get("/error", (req, res) => {
  throw new Error("database failed");
});

router.get("/:id", validateId, getProduct);


router.put("/:id", validateId,protect, updateProduct);

router.post("/", protect,createProduct);

router.delete("/:id", validateId,protect, deleteProduct);
module.exports = router;


const name=()=>{

}






