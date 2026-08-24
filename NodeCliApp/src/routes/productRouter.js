const express = require("express");

const { validateId } = require("../middleware/ValidateId");
const {
  getProducts,
  getProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  giveReview,
  getReview,
  deleteReview,
  aggregateProduct,
} = require("../controllers/productController");
const protect = require("../middleware/authProvider");
const asyncHanlder = require("../middleware/asyncHandler");
const Product = require("../../model/Product");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/",cacheMiddleware('products',60), asyncHanlder(getProducts));
router.get("/analytics", asyncHanlder(aggregateProduct));
// router.get("/analytics/products", asyncHanlder(aggregateProduct));

// router.get("/error", (req, res) => {
//   throw new Error("database failed");
// });

router.get("/:id", protect,validateId,cacheMiddleware('product',200), asyncHanlder(getProduct));

router.put("/:id", validateId, protect, adminAuth,asyncHanlder(updateProduct));

router.post("/",protect, adminAuth,asyncHanlder(createProduct));

router.delete("/:id", validateId, protect, adminAuth, asyncHanlder(deleteProduct));
router.post("/:id/reviews", validateId, protect, asyncHanlder(giveReview));
router.get("/:id/reviews", validateId, asyncHanlder(getReview));
router.delete("/reviews/:id", validateId, protect, asyncHanlder(deleteReview));

module.exports = router;
