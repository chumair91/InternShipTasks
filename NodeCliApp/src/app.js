require("dotenv").config();

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
const port = process.env.PORT || 3500;
app.use(morgan("dev"));
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));
const path = require("path");
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
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
