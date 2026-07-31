const express=require('express');
const asyncHanlder = require('../middleware/asyncHandler');
const { getCacheStats } = require('../controllers/cacheController');
const router=express.Router();


router.get('/stats',asyncHanlder(getCacheStats));

module.exports=router;

