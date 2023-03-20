const {
  updateSubscriptionContact,
  logoutContact,
  currentContact,
} = require("../services/authService");

const subscriptionController = async (req, res) => {
  const subscription = req.body.subscription;
  const owner = req.user._id;

  await updateSubscriptionContact(owner, { subscription });
  res.json({ status: "contact changed subscription" });
};

const logoutController = async (req, res) => {
  const owner = req.user._id;
  await logoutContact(owner);

  res.status(204).json({ message: "Token deleted" });
};

const currentController = async (req, res) => {
  const owner = req.user._id;
  const currentUser = await currentContact(owner);

  res.json({ currentUser });
};

module.exports = {
  subscriptionController,
  logoutController,
  currentController,
};
