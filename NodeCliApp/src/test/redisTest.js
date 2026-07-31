const { config } = require("dotenv");
const redis = require("../../config/redis");


async function redisTestor(){
  
console.log(config);

await redis.set("name", "Umair");

const value = await redis.get("name");

console.log(value);  
}


redisTestor();