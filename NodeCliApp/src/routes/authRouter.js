const express = require("express");
const {
  regUser,
  loginUser,
  updateAddress
} = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authProvider");
const router = express.Router();

router.post("/register", asyncHandler(regUser));
router.post("/login", asyncHandler(loginUser));
router.put('/me/address',protect,asyncHandler(updateAddress))
// router.post("/me",verifyUser);

module.exports = router;
