const express = require("express");
const { default: mongoose } = require("mongoose");
const Order = require("../../model/Order");
const Product = require("../../model/Product");
const protect = require("../middleware/authProvider");
const asyncHanlder = require("../middleware/asyncHandler");
const placeOrder = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, asyncHanlder(placeOrder));

module.exports = router;
