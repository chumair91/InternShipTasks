const express = require("express");
const {
  regUser,
  loginUser,
  updateAddress,
  deleteUser,
  verifyUser
} = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authProvider");
const { validateId } = require("../middleware/ValidateId");
const router = express.Router();

router.post("/register", asyncHandler(regUser));
router.post("/login", asyncHandler(loginUser));
router.put('/me/address',protect,asyncHandler(updateAddress))
router.get("/me",protect,verifyUser);
router.delete('/:id',validateId,protect,asyncHandler(deleteUser))
module.exports = router;
