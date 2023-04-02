const express = require("express");
const router = new express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const { createUserValidator } = require("../middlleware/validator");
const { authMiddleware } = require("../middlleware/authMiddleware");
const { uploadMiddleware } = require("../middlleware/uploadMiddleware");

const {
  registerController,
  loginController,
  verificationController,
  reVerificationByEmailController,
} = require("../controllers/authController");
const {
  subscriptionController,
  logoutController,
  currentController,
} = require("../controllers/subscriptionController");
const { avatarChangeController } = require("../controllers/contactsController");

// ! Создали роуты логина и регистрации для обработки в основном модуле
router.post("/register", createUserValidator, asyncWrapper(registerController));
router.post("/login", asyncWrapper(loginController));
router.post("/logout", authMiddleware, asyncWrapper(logoutController));
router.post("/current", authMiddleware, asyncWrapper(currentController));
router.patch("/", authMiddleware, asyncWrapper(subscriptionController));
router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  asyncWrapper(avatarChangeController)
);
router.get(
  "/auth/verify/:verificationToken",
  asyncWrapper(verificationController)
);
router.post("/verify", asyncWrapper(reVerificationByEmailController));

module.exports = { authRouter: router };
