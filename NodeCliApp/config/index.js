require("dotenv").config();

// const required = ["JWT_SECRET_KEY", "NODE_ENV", "MONGO_URI"];

// required.forEach((key) => {
//   if (!process.env[key]) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
// });

const config = {
  port: process.env.PORT || 3500,
  jwtSecret: process.env.JWT_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV,
  dburl: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL,
  redisDefUserPassword: process.env.REDIS_DEF_USER_PASS,
  redisUsername: process.env.REDIS_USERNAME,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  stripeSecret:process.env.STRIPE_SECRET_KEY,
  stripWebhookSecret:process.env.STRIPE_WEBHOOK_SECRET,
  stripeBasicPlan:process.env.STRIPE_BASIC_PRICE_ID,
  stripeProPlan:process.env.STRIPE_PRO_PRICE_ID
};

module.exports = config;
