const express = require("express");
const { regUser, loginUser, verifyUser } = require("../controllers/authController");
const router=express.Router();

router.post("/register",regUser);
router.post("/login",loginUser);
// router.post("/me",verifyUser);


module.exports=router;