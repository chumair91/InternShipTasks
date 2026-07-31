const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
const config = require("../config/index");

const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/upload");
const webhookRoutes=require('./routes/webhookRoutes')
const helmet = require("helmet");
const morgan = require("morgan");
const notFound = require("./middleware/notFound");
const { validateId } = require("./middleware/ValidateId");
const errorHandler = require("./middleware/errorHandler");

const limiter = require("./middleware/Limiter");

const port = config.port;
app.use(morgan("dev"));
app.use(limiter);

app.use(helmet());
app.use("/api/webhooks", express.raw({type:'application/json'}),webhookRoutes);
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const connectDB = require("../config/db");
const Product = require("../model/Product");
const orderRouter = require("./routes/orderRoute");
const cacheRouter=require('./routes/cacheRouter');
const stripeRouter=require('./routes/stripeRouter')
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cache/",cacheRouter);
app.use('/api/subscriptions/',stripeRouter)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
  res.send("hi");
});
app.use(notFound);
app.use(validateId);
app.use(errorHandler);

let server;

const start = async () => {
  try {
    await connectDB();

    server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Application failed to start.", error.message);
  }
};

start();

process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

function gracefulShutdown(signal) {
  console.log(`${signal} received.`);
  server.close(() => {
    console.log("http server closed");
    process.exit(0);
  });
}
