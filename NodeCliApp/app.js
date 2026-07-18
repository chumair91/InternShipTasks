const express = require("express");
const productRouter = require("./routes/productRouter");

const app = express();
const port = 3500;
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);

app.get("/",(req,res)=>{
    res.send("hi")
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
