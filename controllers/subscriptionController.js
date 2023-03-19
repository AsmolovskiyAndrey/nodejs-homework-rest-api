const {
  updateSubscriptionContact,
  logoutContact,
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
  res.status(204);
};

module.exports = { subscriptionController, logoutController };
