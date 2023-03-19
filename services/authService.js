const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../db/userModel");
// const { Contacts } = require("../db/contactModel");
const { AppError } = require("../helpers/errors");
const allSubscription = ["starter", "pro", "business"];

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

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, `Email or password is wrong`);
  }

  const token = jwt.sign(
    { _id: user._id, subscription: user.subscription },
    process.env.JWT_SECRET
  );
  await User.findByIdAndUpdate(user._id, { $set: { token } });

  const responseUser = await User.findOne({ email }).select(
    "-_id -__v -password"
  );
  return responseUser;
};

const logoutContact = async (owner) => {
  const user = await User.findOne({ _id: owner });

  if (!owner || !user) {
    throw new AppError(401, "Not authorized");
  }
  await User.findOneAndUpdate({ _id: owner }, { $set: { token: null } });
};

const updateSubscriptionContact = async (owner, { subscription }) => {
  const user = await User.findOne({ _id: owner });
  if (!owner || !user) {
    throw new AppError(400, `Update Subscription imposibble - No user`);
  }

  if (!allSubscription.includes(subscription)) {
    throw new AppError(
      400,
      `Update Subscription imposibble - No "starter", "pro", "business"`
    );
  }
  await User.findOneAndUpdate(owner, { $set: { subscription } });
};

module.exports = {
  registrer,
  login,
  updateSubscriptionContact,
  logoutContact,
};
