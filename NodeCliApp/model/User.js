const { default: mongoose } = require("mongoose");

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
  },
  {
    timeStamps: true,
  },
);

UserSchema.pre("save", async (next) => {
  if (this.isModified("password")) {
    return next();
  }
  const hashedPasswrd = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
