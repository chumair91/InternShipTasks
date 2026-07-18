const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: "too many requests,cool down for a bit and try again later",
  },
});

module.exports = limiter;
