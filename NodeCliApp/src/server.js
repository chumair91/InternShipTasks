const { port } = require("../config");
const connectDB = require("../config/db");
const app = require("./app");
const startJobs = require("./jobs");
const { initializeSocket } = require("./socket");

require('./workers/emailWorker');
require('./workers/stockWorker');
require('./workers/paymentWorker');
require('./workers/orderWorker');
require('./workers/rollbackWorker');
require('./workers/reportWorker'); 
require('./workers/failedJobWorker');

let server;

const start = async () => {
  try {
    await connectDB();
    startJobs();
    server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
       initializeSocket(server);
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
