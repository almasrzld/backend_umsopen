import { check } from "express-validator";
import { errorValidation } from "../../middlewares/error-validation.js";

export const validateRegister = [
  check("email").isEmail().withMessage("Email tidak valid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  errorValidation,
];

export const validateLogin = [
  check("email").isEmail().withMessage("Email tidak valid"),
  check("password").notEmpty().withMessage("Password tidak boleh kosong"),
  errorValidation,
];
