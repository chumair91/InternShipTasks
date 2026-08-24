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

  if (!response.body || !response.body.token) {
    throw new Error(`Login failed in test helper: ${JSON.stringify(response.body)}`);
  }

  return response.body.token;
};

module.exports = createUserAndGetToken;
