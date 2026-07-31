const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
    address: {
      street: String,
      city: String,
      country: String,
      zipCode: String,
    },
    stripeCustomerId: {
      type: String,
    },
    paymentFailed: {
      type: Boolean,
      default: false,
    },
    paymentFailureReason: {
      type: String,
      default: null,
    },
    subscription: {
      stripeSubscriptionId: { type: String },
      plan: {
        type: String,
        default: "free",
      },
      status: String,
      currentPeriodEnd: Date,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

UserSchema.virtual("fullAddress").get(function () {
  return `${this.address.street},${this.address.city},${this.address.country} ${this.address.zipCode}`;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
