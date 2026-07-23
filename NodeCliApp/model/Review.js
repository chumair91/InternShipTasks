const { default: mongoose } = require("mongoose");
const Product = require("./Product");

const ReviewSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

ReviewSchema.post("save", async function () {
  // const p=await Product.findById(this.product);
  // console.log('product',p);
  const review = await this.constructor.find({ product: this.product });
//   console.log("Reviews for this", review);

  const count = review.length;
  if (count === 0) {
      // If no reviews, reset product ratings
      await Product.findByIdAndUpdate(this.product, {
        averageRating: 0,
        reviewCount: 0,
      });
      return;
    }
  const totalRating = review.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = round(totalRating / count);
   await Product.findByIdAndUpdate(this.product, {
    averageRating: avgRating.toFixed(2),
    reviewCount: count,
  });
});

module.exports = mongoose.model("Review", ReviewSchema);
