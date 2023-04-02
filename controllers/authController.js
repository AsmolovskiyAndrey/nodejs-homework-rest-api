const { registrer, login, verification } = require("../services/authService");

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

module.exports = {
  registerController,
  loginController,
  verificationController,
};
