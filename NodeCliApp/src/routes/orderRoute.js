const express = require('express');
const { default: mongoose } = require('mongoose');
const Order = require('../../model/Order');
const Product = require('../../model/Product');
const protect = require('../middleware/authProvider');
const asyncHanlder = require('../middleware/asyncHandler');
const { placeOrder, orderStatus } = require('../controllers/orderController');

const router = express.Router();

router.post('/', protect, asyncHanlder(placeOrder));
router.get('/payment-status/:identifier', protect, asyncHanlder(orderStatus));
module.exports = router;
