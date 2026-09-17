const invalidateProductCache=async (productId)=>{
      if (productId) {
        await redis.del(`product:/api/products/${productId}`);
    }
      const keys = await redis.keys('products:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
}

module.exports=invalidateProductCache;