const { registrer, login } = require("../services/authService");

const registerController = async (req, res) => {
  const { email, password } = req.body;
  const newUser = await registrer(email, password);

  res.status(201).json({ user: newUser });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const token = await login(email, password);
  res.json({ status: "login ok", token });
};

module.exports = {
  registerController,
  loginController,
};
