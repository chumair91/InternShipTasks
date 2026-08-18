const express = require('express');
const {
  regUser,
  loginUser,
  updateAddress,
  deleteUser,
  verifyUser,
  refreshAccessToken,
  logoutUser,
  forgetPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');

const asyncHandler = require('../middleware/asyncHandler');
const protect = require('../middleware/authProvider');
const { validateId } = require('../middleware/ValidateId');
const {
  registerValidator,
  validateCredentials,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../middleware/validators/authValidators');
const router = express.Router();

router.post(
  '/register',
  registerValidator,
  validateCredentials,
  asyncHandler(regUser)
);
router.post(
  '/login',
  loginValidator,
  validateCredentials,
  asyncHandler(loginUser)
);
router.post('/logout', asyncHandler(logoutUser));

router.put('/me/address', protect, asyncHandler(updateAddress));
router.get('/me', protect, verifyUser);
router.post('/refresh', refreshAccessToken);
router.delete('/:id', validateId, protect, asyncHandler(deleteUser));

router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateCredentials,
  asyncHandler(forgetPassword)
);
router.post('/reset-password/:token', resetPasswordValidator,validateCredentials,asyncHandler(resetPassword));
router.post(
  '/change-password',
  changePasswordValidator,
  validateCredentials,
  protect,
  asyncHandler(changePassword)
);
module.exports = router;
