const { default: mongoose } = require("mongoose");
const config = require("./index");
async function connectDB() {
  try {
    await mongoose.connect(config.dburl);
    console.log("mongo connected ");
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error.message);
    
    throw error;
  }
}

mongoose.connection.on("connected", () => {
  console.log("mongo connected");
});
mongoose.connection.on("disconnected", () => {
  console.log("mongo disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log("error while connecting mongo", err);
});
module.exports = connectDB;
