const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/errors");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Not authorized");
    }
    const user = jwt.decode(token, process.env.JWT_SECRET);
    // req.token = token;
    req.user = user;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid token");
  }
};

module.exports = { authMiddleware };
