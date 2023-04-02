const {
  registrer,
  login,
  verification,
  reVerificationByEmail,
} = require("../services/authService");

const registerController = async (req, res) => {
  const { email, password } = req.body;
  const newUser = await registrer(email, password);

  res.status(201).json({ user: newUser });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const userWithToken = await login(email, password);

  res.status(200).json({ user: userWithToken });
};

const verificationController = async (req, res) => {
  const { verificationToken } = req.params;
  await verification(verificationToken);
  res.status(200).json({ message: "Verification successful" });
};

const reVerificationByEmailController = async (req, res) => {
  const { email } = req.body;
  await reVerificationByEmail(email);
  res.status(200).json({ message: "Resending email for verification" });
};

module.exports = {
  registerController,
  loginController,
  verificationController,
  reVerificationByEmailController,
};
