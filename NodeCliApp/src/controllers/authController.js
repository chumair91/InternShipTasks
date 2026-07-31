const users = require("../store/users");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../../model/User");
const { default: mongoose } = require("mongoose");
const Review = require("../../model/Review");
const Order = require("../../model/Order");
const redis = require("../../config/redis");

const regUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  console.log(User);
  const existingUser = await User.findOne({ email });

  // const user = users.find((f) => f.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User Already exist", success: false });
  }
  // const hashedPasswrd = await bcrypt.hash(password, 10);

  // let newId;
  // users.length === 0 ? (newId = 1) : (newId = users[users.length - 1].id + 1);
  // users.push({ id: newId, name, email, password: hashedPasswrd });
  const user = await User.create({ name, email, password });
  const token = jwt.sign(
    {
      id: user.id,
      name,
      email,
    },
    config.jwtSecret,
    { expiresIn: "1h" },
  );

  return res
    .status(201)
    .json({ message: "token created", success: true, token, data: user });
};

const updateAddress = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { address: req.body },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  return res.status(201).json({ success: true, message: "address updated" });
};
const deleteUser = async (req, res) => {
  const reqUser = req.user;
  if (reqUser.role != "admin") {
    return res.status(403).json({
      success: false,
      message: "Only admin can perform this action ",
    });
  }
  let data = {};
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const user = await User.findByIdAndDelete(req.params.id, { session });
    if (!user) {
      throw new Error("User not found");
    }
    const review = await Review.deleteMany(
      { user: req.params.id },
      { session },
    );
    let reviewRes = "";
    if (review.deletedCount === 0) {
      reviewRes = "No review of this user in our system";
    }
    //  if (!review) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "No Review found for this user ",
    //   });
    // }

    const order = await Order.deleteMany({ user: req.params.id }, { session });
    let orderRes = "";
    if (order.deletedCount === 0) {
      orderRes = "No order of this user in our system";
    }

    data = {
      user,
      review: review ? review : reviewRes,
      order: order ? order : orderRes,
    };
  });
  return res.status(201).json({
    success: true,
    message: "user deleted",
    data: data,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
      success: false,
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );
  const key = `session:${user.id}`;

  const userSession = {
    name: user.name,
    role: user.role,
    email: user.email,
  };

  await redis.setex(key, 3600, JSON.stringify(userSession));
  return res
    .status(201)
    .json({ message: "token created", success: true, token });
};

const verifyUser = async (req, res) => {
  const userData = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    plan: req.user.subscription.plan,
  };
  res.json({ success: true, data: userData });
};

module.exports = { regUser, loginUser, updateAddress, deleteUser, verifyUser };
