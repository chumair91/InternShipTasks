const config = require("../../config");

function errorHandler(err, req, res, next) {
  console.error(err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "internal server error";
  const isDev = config.nodeEnv === "development";

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // Expired JWT
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  // Multer validation errors
  if (err.name === "MulterError") {
    statusCode = 400;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: isDev
      ? message
      : statusCode === 500
        ? "Internal server error"
        : message,
    ...(isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;
