const express = require("express");
const {
  regUser,
  loginUser,
  verifyUser,
} = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

router.post("/register", asyncHandler(regUser));
router.post("/login", asyncHandler(loginUser));
// router.post("/me",verifyUser);

module.exports = router;
