const { registrer, login } = require("../services/authService");

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

module.exports = {
  registerController,
  loginController,
};
