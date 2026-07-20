const bcrypt = require("bcrypt");
const users = require("../store/users");
const jwt = require("jsonwebtoken");

const regUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  const user = users.find((f) => f.email === email);
  if (user) {
    return res
      .status(500)
      .json({ message: "User Already exist", success: false });
  }
  const hashedPasswrd = await bcrypt.hash(password, 10);

  if (!hashedPasswrd) {
    return res
      .status(500)
      .json({ message: "Error hashing password", success: false });
  }

  let newId;
  users.length === 0 ? (newId = 1) : (newId = users[users.length - 1].id + 1);
  users.push({ id: newId, name, email, password: hashedPasswrd });

  try {
    const token = jwt.sign(
      {
        id: newId,
        name,
        email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    return res
      .status(201)
      .json({ message: "token created", success: true, token });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating token",
      success: false,
      error: error.message,
    });
  }
};

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = users.find((f) => f.email === email);

    if (!user) {
      return res.status(500).json({
        message: "User not found",
        success: false,
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
  } catch (error) {
    return res.status(500).json({
      message: "Error logging user in ",
      success: false,
      error: error.message,
    });
  }
};



module.exports = { regUser, loginUser};
