const express = require("express");
const router = new express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");

const {
  registerController,
  loginController,
} = require("../controllers/authController");

// ! Создали роуты логина и регистрации для обработки в основном модуле
router.post("/register", asyncWrapper(registerController));
router.post("/login", asyncWrapper(loginController));

module.exports = { authRouter: router };
