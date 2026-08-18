const thirtyDaysReport = require('../controllers/AdminController');
const adminAuth = require('../middleware/adminAuth');
const asyncHanlder = require('../middleware/asyncHandler');
const protect = require('../middleware/authProvider');

const router=require('express').Router();

router.get('/reports/daily',protect,adminAuth,asyncHanlder(thirtyDaysReport))

module.exports=router;