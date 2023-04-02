const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const sgMail = require("@sendgrid/mail");
const uniqid = require("uniqid");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { User } = require("../db/userModel");
const { AppError } = require("../helpers/errors");
const allSubscription = ["starter", "pro", "business"];

const registrer = async (email, password) => {
  const findUser = await User.findOne({ email });
  if (findUser) {
    throw new AppError(409, `This ${email} in use`);
  }

  const avatarURL = await gravatar.url(email);
  const verificationToken = uniqid(`${email}-`);

  const user = new User({ email, password, verificationToken, avatarURL });
  await user.save(); //! Хук сделает сам ХЭШ пароля при save (user Model)

  const responseUser = await User.findOne({ email }).select(
    "-_id -__v -token -password"
  );

  const msg = {
    to: email,
    from: "asmolovskiy0202@gmail.com",
    subject: "Completion of registration",
    text: `Please, confirm your email address GET - http://localhost:8083/api/users/auth/verify/${verificationToken}`,
    html: `<h1>Please, <a href="http://localhost:8083/api/users/auth/verify/${verificationToken}">confirm</a> your email address</h1>`,
  };
  await sgMail.send(msg);

  return responseUser;
};

const reVerificationByEmail = async (email) => {
  if (!email) {
    throw new AppError(400, "missing required field email");
  }
  const emailVerificationUser = await User.findOne({ email });

  if (!emailVerificationUser) {
    throw new AppError(404, `User ${email} not found `);
  }

  if (emailVerificationUser.verify === true) {
    throw new AppError(400, "Verification has already been passed");
  }

  const msgRegistarationRepeat = {
    to: emailVerificationUser.email,
    from: "asmolovskiy0202@gmail.com",
    subject: "Re-verification by mail",
    text: `Please, confirm your email address GET - http://localhost:8083/api/users/auth/verify/${emailVerificationUser.verificationToken}`,
    html: `<h1>Please, <a href="http://localhost:8083/api/users/auth/verify/${emailVerificationUser.verificationToken}">confirm</a> your email address</h1>`,
  };
  await sgMail.send(msgRegistarationRepeat);
};

const verification = async (verificationToken) => {
  const verificationUser = await User.findOne({
    verificationToken,
    verify: false,
  });
  if (!verificationUser) {
    throw new AppError(404, `User not found`);
  }
  verificationUser.verificationToken = "null";
  verificationUser.verify = true;

  await verificationUser.save();

  const msgRegistarationOk = {
    to: verificationUser.email,
    from: "asmolovskiy0202@gmail.com",
    subject: "Thank you for registration",
    text: `Registration completed successfully. !!!`,
    html: `<h1>Registration completed successfully. !!!</h1>`,
  };
  await sgMail.send(msgRegistarationOk);
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(401, `Email is wrong`);
  }
  if (user.verify === false) {
    throw new AppError(400, `Verification Failed`);
  }

  const compareUser = await bcrypt.compare(password, user.password);
  console.log(compareUser);
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
  verification,
  reVerificationByEmail,
  login,
  updateSubscriptionContact,
  logoutContact,
  currentContact,
  avatarChange,
};
