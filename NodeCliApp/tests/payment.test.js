const request = require('supertest');
const app = require('../src/app');
const createUserAndGetToken = require('./helpers/auth');
const stripe = require('../config/stripe');

jest.mock('../config/stripe', () => ({
  customers: {
    create: jest.fn(),
  },
  subscriptions: {
    list: jest.fn(),
    create: jest.fn(),
    cancel: jest.fn(),
    update: jest.fn(),
  },
  invoices: {
    list: jest.fn(),
  },
  products: {
    list: jest.fn(),
  },
  charges: {
    list: jest.fn(),
  },
  paymentIntents: {
    list: jest.fn(),
  },
}));

describe('POST /api/subscriptions/create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a subscription successfully', async () => {
    stripe.customers.create.mockResolvedValue({
      id: 'cus_test123',
    });
    stripe.subscriptions.list
      .mockResolvedValueOnce({
        data: [],
      })
      .mockResolvedValueOnce({
        data: [],
      });
    stripe.subscriptions.create.mockResolvedValue({
      id: 'sub_test123',
      latest_invoice: {
        confirmation_secret: {
          client_secret: 'pi_test_secret',
        },
      },
    });
    const token = await createUserAndGetToken('user');
    const response = await request(app)
      .post('/api/subscriptions/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: 'basic',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Plz select a payment method');
    expect(response.body.clientSecret).toBe('pi_test_secret');

    expect(stripe.customers.create).toHaveBeenCalledTimes(1);
    expect(stripe.subscriptions.create).toHaveBeenCalledTimes(1);
  });

  it('should reject creating a subscription when user already has an active subscription', async () => {
    stripe.customers.create.mockResolvedValue({
      id: 'cus_test123',
    });
    stripe.subscriptions.list.mockResolvedValue({
      data: [
        {
          id: 'sub_existing123',
          status: 'active',
        },
      ],
    });
    const token = await createUserAndGetToken('user');
    const response = await request(app)
      .post('/api/subscriptions/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: 'basic',
      });

     expect(response.statusCode).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(
    'You already have an active subscription,try to cancel that first.'
  );

  expect(stripe.subscriptions.create).not.toHaveBeenCalled();
  });

  it('should cancel existing incomplete subscriptions before creating a new one', async () => {
  stripe.customers.create.mockResolvedValue({
    id: 'cus_test123',
  });

  // First call: active subscriptions
  stripe.subscriptions.list.mockResolvedValueOnce({
    data: [],
  });

  // Second call: incomplete subscriptions
  stripe.subscriptions.list.mockResolvedValueOnce({
    data: [
      {
        id: 'sub_incomplete123',
        status: 'incomplete',
      },
    ],
  });

  stripe.subscriptions.cancel.mockResolvedValue({
    id: 'sub_incomplete123',
    status: 'canceled',
  });

  stripe.subscriptions.create.mockResolvedValue({
    id: 'sub_new123',
    latest_invoice: {
      confirmation_secret: {
        client_secret: 'secret_test123',
      },
    },
  });

  const token = await createUserAndGetToken('user');

  const response = await request(app)
    .post('/api/subscriptions/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      plan: 'basic',
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.clientSecret).toBe('secret_test123');

  expect(stripe.subscriptions.cancel).toHaveBeenCalledWith(
    'sub_incomplete123'
  );

  expect(stripe.subscriptions.create).toHaveBeenCalled();
});
});
