const mongoose = require('mongoose');
const config = require('../config');
const redis = require('../config/redis');
const bullRedis = require('../config/bullRedis');
const emailQueue = require('../src/queues/emailQueue');
const stockQueue = require('../src/queues/stockQueue');
const paymentQueue = require('../src/queues/paymentQueue');
const orderQueue = require('../src/queues/orderQueue');
const rollbackQueue = require('../src/queues/rollbackQueue');
const reportQueue = require('../src/queues/reportQueue');
const failedjobQueue = require('../src/queues/failedjobQueue');

beforeAll(async () => {
  await mongoose.connect(config.mongoTest);
  console.log('mongo test connected', mongoose.connection.name);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  await Promise.allSettled([
    emailQueue.close(),
    stockQueue.close(),
    paymentQueue.close(),
    orderQueue.close(),
    rollbackQueue.close(),
    reportQueue.close(),
    failedjobQueue.close(),
  ]);

  if (redis.status !== 'end') {
    redis.disconnect();
  }
  if (bullRedis.status !== 'end') {
    bullRedis.disconnect();
  }
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
