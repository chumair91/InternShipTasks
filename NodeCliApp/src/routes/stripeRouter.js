const express=require('express');

const asyncHanlder = require('../middleware/asyncHandler');
const { createSubscription, checkConnection, getUserDetails, cancelSubscription, paymentHistory } = require('../controllers/stripeController');
const protect = require('../middleware/authProvider');
const router=express.Router();

router.post('/create',protect,asyncHanlder(createSubscription));
router.get('/check',asyncHanlder(checkConnection));
router.get('/me',protect,asyncHanlder(getUserDetails));
router.post('/cancel',protect,asyncHanlder(cancelSubscription))
router.get('/payments/history',protect,asyncHanlder(paymentHistory));
module.exports=router;