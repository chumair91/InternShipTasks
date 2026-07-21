const required = ["JWT_SECRET_KEY","NODE_ENV"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const config = {
  port: process.env.PORT || 3500,
  jwtSecret: process.env.JWT_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV,
};

module.exports = config;
