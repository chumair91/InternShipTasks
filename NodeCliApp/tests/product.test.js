const request = require('supertest');
const app = require('../src/app');
const createUserAndGetToken = require('./helpers/auth');
const Product = require('../model/Product');

describe('GET /api/products', () => {
  it('should create a product when admin is authenticated', async () => {
    const token = await createUserAndGetToken('admin');
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        price: 100,
        category: 'electronics',
        quantity: 10,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('product added with id');
  });

  it('should reject a regular user for creating a product', async () => {
    const token = await createUserAndGetToken('user');
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'unAuthorized  Product',
        price: 100,
        category: 'electronics',
        quantity: 10,
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('admin only');
  });

  it('should reject an unauthenticated request', async () => {
    const response = await request(app).post('/api/products').send({
      name: 'Unauthorized Product',
      price: 100,
      category: 'electronics',
      quantity: 10,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe('GET /api/products/:id', () => {
  it('should return a product for an authenticated user', async () => {
    const adminToken = await createUserAndGetToken('admin');
    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Get Test Product',
        price: 250,
        category: 'electronics',
        quantity: 5,
      });

    expect(createResponse.statusCode).toBe(201);

    const product = await Product.findOne({
      name: 'Get Test Product',
    });

    const userToken = await createUserAndGetToken('user');
    const response = await request(app)
      .get(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Product found');
    expect(response.body.data.name).toBe('Get Test Product');
    expect(response.body.data.price).toBe(250);
  });

  it('should reject unauthenticated user', async () => {
    const adminToken = await createUserAndGetToken('admin');
    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Auth Test Product',
        price: 250,
        category: 'electronics',
        quantity: 5,
      });

    expect(createResponse.statusCode).toBe(201);
    const product = await Product.findOne({
      name: 'Auth Test Product',
    });

    const response = await request(app).get(`/api/products/${product._id}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

});



describe('PUT /api/products/:id', () => {
  it('should update a product when admin is authenticated', async () => {
    const adminToken = await createUserAndGetToken('admin');

    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Update Test Product',
        price: 100,
        category: 'electronics',
        quantity: 10,
      });

    expect(createResponse.statusCode).toBe(201);

    const Product = require('../model/Product');
    const product = await Product.findOne({
      name: 'Update Test Product',
    });

    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 200,
        quantity: 20,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('product updated');
    expect(response.body.data.price).toBe(200);
    expect(response.body.data.quantity).toBe(20);
  });
  it('should reject a regular user from updating a product', async () => {
  const adminToken = await createUserAndGetToken('admin');

  const createResponse = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Protected Update Product',
      price: 100,
      category: 'electronics',
      quantity: 10,
    });

  expect(createResponse.statusCode).toBe(201);

  const Product = require('../model/Product');

  const product = await Product.findOne({
    name: 'Protected Update Product',
  });

  const userToken = await createUserAndGetToken('user');

  const response = await request(app)
    .put(`/api/products/${product._id}`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      price: 999,
    });

  expect(response.statusCode).toBe(403);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('admin only');
});
});