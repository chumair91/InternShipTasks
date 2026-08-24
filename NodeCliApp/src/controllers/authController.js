const users = require('../store/users');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../model/User');
const { default: mongoose } = require('mongoose');
const Review = require('../../model/Review');
const Order = require('../../model/Order');
const redis = require('../../config/redis');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {
  recordAttempt,
  checkBruteLock,
  resetAttempts,
} = require('../middleware/loginBruteProtector');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/tokenGenerator');

const regUser = async (req, res) => {
  const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   return res.status(400).json({
  //     message: 'All fields are required',
  //   });
  // }
  // console.log(User);
  const existingUser = await User.findOne({ email });

  // const user = users.find((f) => f.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ message: 'User Already exist', success: false });
  }

  const user = await User.create({ name, email, password });
  // const token = jwt.sign(
  //   {
  //     id: user.id,
  //     name,
  //     email,
  //   },
  //   config.jwtSecret,
  //   { expiresIn: '1h' }
  // );

  return res.status(201).json({
    message: 'Account created,you can login now',
    success: true,
    data: user,
  });
};

const updateAddress = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { address: req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'user not found',
    });
  }
  return res.status(201).json({ success: true, message: 'address updated' });
};
const deleteUser = async (req, res) => {
  const reqUser = req.user;
  if (reqUser.role != 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admin can perform this action ',
    });
  }
  let data = {};
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const user = await User.findByIdAndDelete(req.params.id, { session });
    if (!user) {
      throw new Error('User not found');
    }
    const review = await Review.deleteMany(
      { user: req.params.id },
      { session }
    );
    let reviewRes = '';
    if (review.deletedCount === 0) {
      reviewRes = 'No review of this user in our system';
    }
    //  if (!review) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "No Review found for this user ",
    //   });
    // }

    const order = await Order.deleteMany({ user: req.params.id }, { session });
    let orderRes = '';
    if (order.deletedCount === 0) {
      orderRes = 'No order of this user in our system';
    }

    data = {
      user,
      review: review ? review : reviewRes,
      order: order ? order : orderRes,
    };
  });
  return res.status(201).json({
    success: true,
    message: 'user deleted',
    data: data,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  // if (!email || !password) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'All fields are required',
  //   });
  // }

  const bruteLock = await checkBruteLock(email);
  if (bruteLock.blocked) {
    return res.status(429).json({
      success: false,
      message: 'Too many failed attempts,Account locked temporarily',
      retryAfter: bruteLock.remainingTime + ' minutes',
    });
  }
  const user = await User.findOne({ email });

  if (!user) {
    const attempts = await recordAttempt(email);
    return res.status(400).json({
      message: 'User not found',
      success: false,
      attemptsRemaining: Math.max(0, 5 - attempts),
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const attempts = await recordAttempt(email);
    return res.status(401).json({
      success: false,
      message: 'wrong password',
      attemptsRemaining: Math.max(0, 5 - attempts),
    });
  }
  await resetAttempts(email);
  // const token = jwt.sign(
  //   {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //   },
  //   process.env.JWT_SECRET_KEY,
  //   { expiresIn: '1h' }
  // );

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const key = `session:${user.id}`;

  const userSession = {
    name: user.name,
    role: user.role,
    email: user.email,
  };

  await redis.setex(key, 3600, JSON.stringify(userSession));

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(201).json({
    message: 'Logged in successfully',
    success: true,
    token: accessToken,
  });
};

const verifyUser = async (req, res) => {
  const userData = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    plan: req.user.subscription.plan,
  };
  res.json({ success: true, data: userData });
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing',
      });
    }
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await redis.setex(
      `blacklist:refresh:${refreshToken}`,
      7 * 24 * 60 * 60,
      'blacklisted'
    );

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 10 * 60 * 1000);
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = resetExpires;
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
  console.log('PASSWORD RESET LINK:');
  console.log(resetLink);

  return res.status(200).json({
    success: true,
    message: 'If an account exists, a reset link has been sent',
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  const key = `session:${user.id}`;
  await redis.del(key);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  // if (!currentPassword || !newPassword) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Current password and new password are required',
  //   });
  // }
  console.log(req.user);

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect,try forgot password',
    });
  }

  // const samePassword = await user.comparePassword(newPassword);
  // if (samePassword) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'New password must be different',
  //   });
  // }

  user.password = newPassword;
  await user.save();
  await redis.del(`session:${user.id}`);
  return res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in again.',
  });
};
module.exports = {
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
};
