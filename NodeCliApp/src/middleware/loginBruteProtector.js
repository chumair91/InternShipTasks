const redis = require('../../config/redis');

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60;

const getkey = (email) => {
  return `login:attempts:${email.toLowerCase()}`;
};

const checkBruteLock = async (email) => {
  const key = getkey(email);
  const attempts = await redis.get(key);
  console.log('Current attempts:', attempts);

  if (attempts && attempts >= MAX_ATTEMPTS) {
    const ttl =await redis.ttl(key);
    return {
      blocked: true,
      remainingTime: Math.floor(ttl/60),
    };
  }
  return {
    blocked: false,
  };
};

const recordAttempt = async (email) => {
  const key = getkey(email);
  const attempts = await redis.incr(key);
  console.log('return value', attempts);

  if (attempts === 1) {
    await redis.expire(key,LOCK_TIME);
  }
  return attempts;
};

const resetAttempts=async (email)=>{
    const key=getkey(email);
    await redis.del(key);
      console.log("Login attempts reset for:", email);
}

module.exports = { recordAttempt,checkBruteLock,resetAttempts };
