const mongoose = require('mongoose');
const config = require('../config');
const redis = require('../config/redis');
// const bullRedis = require('../config/bullRedis');
// const emailQueue = require('../src/queues/emailQueue');
// const stockQueue = require('../src/queues/stockQueue');
// const paymentQueue = require('../src/queues/paymentQueue');
// const orderQueue = require('../src/queues/orderQueue');
// const rollbackQueue = require('../src/queues/rollbackQueue');
// const reportQueue = require('../src/queues/reportQueue');
// const failedjobQueue = require('../src/queues/failedjobQueue');

// Mock bullmq itself first so any module that does `new Queue(...)` /
// `new Worker(...)` at import time (including during jest's auto-mocking
// of the queue files below) never touches a real Redis/ioredis-mock
// connection. This is what was corrupting the shared ioredis-mock client
// and breaking unrelated redis.get/redis.del calls in other middleware.
jest.mock('bullmq', () => {
  const mockQueue = jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    close: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  }));

  const mockWorker = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
  }));

  const mockQueueEvents = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
  }));

  const mockFlowProducer = jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ job: { id: 'mock-flow-job-id' }, children: [] }),
    close: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  }));

  return {
    Queue: mockQueue,
    Worker: mockWorker,
    QueueEvents: mockQueueEvents,
    FlowProducer: mockFlowProducer,
  };
});

jest.mock('../src/queues/emailQueue');
jest.mock('../src/queues/orderQueue');
jest.mock('../src/queues/paymentQueue');
jest.mock('../src/queues/reportQueue');
jest.mock('../src/queues/rollbackQueue');
jest.mock('../src/queues/stockQueue');
jest.mock('../src/queues/failedjobQueue');

beforeAll(async () => {
  await mongoose.connect(config.mongoTest);
  console.log('mongo test connected', mongoose.connection.name);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // await Promise.allSettled([
  //   emailQueue.close(),
  //   stockQueue.close(),
  //   paymentQueue.close(),
  //   orderQueue.close(),
  //   rollbackQueue.close(),
  //   reportQueue.close(),
  //   failedjobQueue.close(),
  // ]);

  if (redis.status !== 'end') {
    redis.disconnect();
  }
  // if (bullRedis.status !== 'end') {
  //   bullRedis.disconnect();
  // }
});

mongoose.connection.on('connected', () => {
  console.log('test mongo connected');
});
mongoose.connection.on('disconnected', () => {
  console.log('test mongo disconnected');
});

mongoose.connection.on('error', (err) => {
  console.log('error while connecting  test mongo', err);
});