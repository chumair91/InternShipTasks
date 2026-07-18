const express = require("express");
const productRouter = require("./routes/productRouter");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const notFound = require("./middleware/notFound");
const { validateId } = require("./middleware/ValidateId");
const errorHandler = require("./middleware/errorHandler");

const limiter = require("./middleware/Limiter");
const app = express();
const port = 3500;
app.use(morgan("dev"));
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);

app.get("/", (req, res) => {
  res.send("hi");
});
app.use(notFound);
app.use(validateId);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
