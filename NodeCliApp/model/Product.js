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
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

ProductSchema.index({category:1})
ProductSchema.index({price:1})

ProductSchema.index({name:'text',category:'text'})
ProductSchema.virtual("discountedPrice").get(function(){
  return this.price*0.9;
})

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Product", ProductSchema);
