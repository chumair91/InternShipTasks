const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
const config = require('../config/index');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const productRouter = require('./routes/productRouter');
const authRouter = require('./routes/authRouter');
const uploadRouter = require('./routes/upload');
const webhookRoutes = require('./routes/webhookRoutes');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const notFound = require('./middleware/notFound');
const { validateId } = require('./middleware/ValidateId');
const errorHandler = require('./middleware/errorHandler');
const { xss } = require('express-xss-sanitizer');
const hpp = require('./middleware/hpp');
const validateContentType = require('./middleware/validateContentType');
const {
  authLimiter,
  apiLimiter,
  adminLimiter,
} = require('./middleware/Limiter');

const port = config.port;
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(limiter);

app.use(
  helmet({
    xPoweredBy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "'data:'", 'https:'],
      },
    },
    xssFilter: true,
    noSniff: true,
  })
);
app.use(
  '/api/webhooks',
  express.raw({ type: 'application/json' }),
  webhookRoutes
);
app.use(validateContentType);
app.use(express.json({ limit: '10kb' })); // Parses JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
const path = require('path');
const connectDB = require('../config/db');
const Product = require('../model/Product');
const orderRouter = require('./routes/orderRoute');
const cacheRouter = require('./routes/cacheRouter');
const stripeRouter = require('./routes/stripeRouter');
const adminRouter = require('./routes/adminRoutes');
require('./workers/emailWorker');
require('./workers/stockWorker');
require('./workers/paymentWorker');
require('./workers/orderWorker');
require('./workers/rollbackWorker');
require('./workers/reportWorker'); 
require('./workers/failedJobWorker');
const startJobs = require('./jobs');
const emailQueue = require('./queues/emailQueue');
const serverAdapter = require('../config/bullBoard');
const protect = require('./middleware/authProvider');
const adminAuth = require('./middleware/adminAuth');


const allowedOrigins = config.allowedOrigins
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS Error: Origin is not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/api/products', apiLimiter, productRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/upload', apiLimiter, uploadRouter);
app.use('/api/orders', apiLimiter, orderRouter);
app.use('/api/cache/', apiLimiter, cacheRouter);
app.use('/api/subscriptions/', stripeRouter);
app.use('/api/admin', adminLimiter, adminRouter);

//testing

app.post('/test-sanitize', (req, res) => {
  console.log(req.body);

  res.json({
    received: req.body,
  });
});

app.get('/test', (req, res) => {
  console.log(req.query);

  res.json({
    query: req.query,
  });
});

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/admin/queues', serverAdapter.getRouter());
app.get('/', (req, res) => {
  res.send('hi');
});
app.use(notFound);
app.use(validateId);
app.use(errorHandler);

let server;

const start = async () => {
  try {
    await connectDB();
    startJobs();
    server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Application failed to start.', error.message);
  }
};

start();

process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

function gracefulShutdown(signal) {
  console.log(`${signal} received.`);
  server.close(() => {
    console.log('http server closed');
    process.exit(0);
  });
}
