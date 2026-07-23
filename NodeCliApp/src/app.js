require("dotenv").config();
const config = require("../config/index");
const express = require("express");
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/upload");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const notFound = require("./middleware/notFound");
const { validateId } = require("./middleware/ValidateId");
const errorHandler = require("./middleware/errorHandler");

const limiter = require("./middleware/Limiter");
const app = express();
const port = config.port;
app.use(morgan("dev"));
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const connectDB = require("../config/db");
const Product = require("../model/Product");

app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
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
