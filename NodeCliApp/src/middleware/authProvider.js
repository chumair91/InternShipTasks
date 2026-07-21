const config = require("../../config");
const User = require("../../model/User");
const users = require("../store/users");
const jwt = require("jsonwebtoken");
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Invalid token. Use Bearer token.",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.jwtSecret);
    // console.log(decoded);
    const user =await User.findById(decoded.id);
    if (!user) {
     return res.status(404).json({ message: "user does not exist", success: false });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};

module.exports = protect;
