const express = require("express");
const products = require("../../Products");
const { validateId } = require("../middleware/ValidateId");
const { getProducts, getProduct, updateProduct, createProduct, deleteProduct } = require("../controllers/productController");
const protect = require("../middleware/authProvider");
const asyncHanlder = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHanlder(getProducts));

// router.get("/error", (req, res) => {
//   throw new Error("database failed");
// });

router.get("/:id", validateId, asyncHanlder(getProduct));


router.put("/:id", validateId,protect, asyncHanlder(updateProduct));

router.post("/", protect,asyncHanlder(createProduct));

router.delete("/:id", validateId,protect, asyncHanlder(deleteProduct));
module.exports = router;









