const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "too many requests,cool down for a bit and try again later",
  },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "too many requests,cool down for a bit and try again later",
  },
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    success: false,
    message: "too many requests,cool down for a bit and try again later",
  },
});

module.exports = {authLimiter,apiLimiter,adminLimiter};

