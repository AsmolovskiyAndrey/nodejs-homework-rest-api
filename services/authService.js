const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../db/userModel");
const { AppError } = require("../helpers/errors");

const registrer = async (email, password) => {
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new AppError(409, `This ${email} in use`);
  }

  const user = new User({ email, password });
  await user.save(); //! Хук сделает сам ХЭШ пароля при save (user Model)
  const responseUser = await User.findOne({ email }).select(
    "-_id -__v -token -password"
  );
  return responseUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(`No user with email: ${email} found`);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new AppError(`Wrong password...`);
  }

  const token = jwt.sign(
    { _id: user._id, createdAt: user.createdAt },
    process.env.JWT_SECRET
  );
  return token;
};

module.exports = {
  registrer,
  login,
};
