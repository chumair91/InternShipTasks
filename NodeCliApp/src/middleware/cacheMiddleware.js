const redis = require("../../config/redis");

const cacheMiddleware =
  (ttl = 60) =>
  async (req, res, next) => {
    const key = req.originalUrl;
    try {
      const cached = await redis.get(key);
      if (cached) {
        console.log("cache hit:", key);
        return res
          .status(200)
          .json({
            sucsess: 200,
            message: "data found",
            data: JSON.parse(cached),
          });
      }
      console.log("cache miss:", key);
      let originalJson = res.json;

      res.json = async function (body) {
        try {
          await redis.setEx(key, ttl, JSON.stringify(body));
          console.log("stored in cache:", key);
        } catch (error) {
          console.log("Redis cache error:", error.message);
        }

        return originalJson.call(this, body);
      };
      next();
    } catch (error) {
      console.log("Redis cache error:", error.message);
    }
  };

module.exports = cacheMiddleware;
