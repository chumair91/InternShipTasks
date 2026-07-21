const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Product", ProductSchema);
