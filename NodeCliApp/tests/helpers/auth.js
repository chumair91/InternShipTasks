const request = require('supertest');
const app = require('../../src/app');
const User = require('../../model/User');

const createUserAndGetToken = async (role = 'user') => {
  const email = `product-${role}-${Date.now()}@example.com`;
  await User.create({
    name: `product ${role}`,
    email,
    password: 'password123',
    role,
  });

  const response = await request(app).post('/api/auth/login').send({
    email,
    password: 'password123',
  });

  return response.body.token;
};

module.exports = createUserAndGetToken;
