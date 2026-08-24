const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const { resetAttempts } = require('../src/middleware/loginBruteProtector');
const { jwtAccessSecret } = require('../config');

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Account created,you can login now');
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'Another User',
      email: 'duplicate@example.com',
      password: 'password123',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User Already exist');
  });

  it('should reject registration when fields are missing', async () => {
    const response = await request(app).post('/api/auth/register').send({});

    expect(response.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('should reject wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Wrong Password User',
      email: 'wrongpass@example.com',
      password: 'password123',
    });
    await resetAttempts('wrongpass@example.com');
    const response = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@example.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('wrong password');
  });

  it('should reject non existent user', async () => {
    await resetAttempts('nonExistingUser@example.com');
    const response = await request(app).post('/api/auth/login').send({
      email: 'nonExistingUser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User not found');
  });
});

describe('GET /api/auth/me', () => {
  it('should return the current user with a valid token', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'password123',
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'me@example.com',
      password: 'password123',
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('me@example.com');
    expect(response.body.data.name).toBe('Me User');
    expect(response.body.data.plan).toBe('free');
  });

  it('should reject request with no token provided', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Authorization header missing');
  });

  it('should reject an expired token ', async () => {
    const expiredToken = jwt.sign(
      {
        id: 'some-user-id',
      },
      jwtAccessSecret,
      {
        expiresIn: '-1s',
      }
    );

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Token has expired');
  });
});
