const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/errors");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(405, "Please, provide a token");
    }
    const user = jwt.decode(token, process.env.JWT_SECRET);
    // req.token = token;
    req.user = user;
    next();
  } catch (error) {
    throw new AppError(405, "Invalid token");
  }
};

module.exports = { authMiddleware };
