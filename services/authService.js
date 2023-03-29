const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;

const { User } = require("../db/userModel");
const { AppError } = require("../helpers/errors");
const allSubscription = ["starter", "pro", "business"];

const registrer = async (email, password) => {
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new AppError(409, `This ${email} in use`);
  }

  const avatarURL = await gravatar.url(email);
  const user = new User({ email, password, avatarURL });
  await user.save(); //! Хук сделает сам ХЭШ пароля при save (user Model)

  const responseUser = await User.findOne({ email }).select(
    "-_id -__v -token -password"
  );
  return responseUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(401, `Email is wrong`);
  }

  const compareUser = await bcrypt.compare(password, user.password);
  if (!compareUser) {
    throw new AppError(401, `Password is wrong`);
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

const currentContact = async (owner) => {
  try {
    const user = await User.findOne({ _id: owner }).select(
      "-_id -__v -password -token"
    );
    return user;
  } catch (error) {
    throw new AppError(401, "Not authorized");
  }
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

const avatarChange = async (originalname, userId) => {
  const uploadedAvatarPath = path.resolve(`./tmp/${originalname}`);
  const avatarName = userId + "-" + originalname;
  const user = await User.findById(userId);
  if (!user) throw new AppError(401, "Not authorized");

  await User.findOneAndUpdate(
    { _id: userId },
    { $set: { avatarURL: `./avatars/${avatarName}` } }
  );

  Jimp.read(uploadedAvatarPath, (err, picture) => {
    if (err) throw err;
    picture
      .resize(250, 250)
      .write(path.resolve(`./public/avatars/${avatarName}`));
  });

  fs.unlink(uploadedAvatarPath);
  return `/api/avatars/${avatarName}`;
};

module.exports = {
  registrer,
  login,
  updateSubscriptionContact,
  logoutContact,
  currentContact,
  avatarChange,
};
