const redis = require("../../config/redis");

const getCacheStats = async (req, res) => {
  const keys = await redis.keys("*");
  let result = [];

  for (let key of keys) {
    const ttl = await redis.ttl(key);

    if (ttl) {
      result.push({
        key,
        ttl,
      });
    }
  }

  res
    .status(200)
    .json({ success: true, message: "keys and ttl", data: result });
};

module.exports = { getCacheStats };
