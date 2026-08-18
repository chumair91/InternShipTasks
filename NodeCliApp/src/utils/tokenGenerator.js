const jwt = require('jsonwebtoken');
const config = require('../../config');

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    config.jwtAccessSecret,
    {
      expiresIn: config.jwtAccessExpiry,
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      type: 'refresh',
    },
    config.jwtRefreshSecret,
    {
      expiresIn: config.jwtRefreshExpiry,
    }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
