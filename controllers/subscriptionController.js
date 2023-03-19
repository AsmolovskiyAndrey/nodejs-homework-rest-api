const { updateSubscriptionContact } = require("../services/authService");

const subscriptionController = async (req, res) => {
  const subscription = req.body.subscription;
  const owner = req.user._id;

  await updateSubscriptionContact(owner, { subscription });
  res.json({ status: "contact changed subscription" });
};

module.exports = { subscriptionController };
