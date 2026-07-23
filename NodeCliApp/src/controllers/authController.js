const users = require("../store/users");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../../model/User");

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
  return res.status(201).json({success:true,message:"address updated"})
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
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
  return res
    .status(201)
    .json({ message: "token created", success: true, token });
};

module.exports = { regUser, loginUser, updateAddress };
