const express = require("express");
const router = new express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const { createUserValidator } = require("../middlleware/validator");
const { authMiddleware } = require("../middlleware/authMiddleware");

const {
  registerController,
  loginController,
} = require("../controllers/authController");
const {
  subscriptionController,
} = require("../controllers/subscriptionController");

// ! Создали роуты логина и регистрации для обработки в основном модуле
router.post("/register", createUserValidator, asyncWrapper(registerController));
router.post("/login", asyncWrapper(loginController));
router.patch("/", authMiddleware, asyncWrapper(subscriptionController));

module.exports = { authRouter: router };
