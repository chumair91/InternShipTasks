const users = require("../store/users");
const jwt=require("jsonwebtoken")
const protect = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    // console.log(authHeader);


    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);
    const user = users.find((f) => f.id === decoded.id);
    if (!user) {
      res.status(404).json({ message: "user does not exist", success: false });
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

module.exports=protect