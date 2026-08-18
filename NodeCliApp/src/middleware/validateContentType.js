const validateContentType = (req, res, next) => {
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];

  if (!methodsWithBody.includes(req.method)) {
    return next();
  }

  if (!req.headers['content-length'] || req.headers['content-length'] === '0') {
    return next();
  }

  const contentType = req.headers['content-type'];

  if (contentType && (contentType.includes('application/json') || contentType.includes('multipart/form-data'))) {
    return next();
  }

  return res.status(415).json({
    success: false,
    message: 'Content-Type must be application/json',
  });
};

module.exports = validateContentType;