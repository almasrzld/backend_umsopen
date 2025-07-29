import { check } from "express-validator";
import { errorValidation } from "../../middlewares/error-validation.js";

export const validateCreateCategory = [
  check("name").notEmpty().withMessage("Nama kategori wajib diisi"),
  check("label").optional().isString().withMessage("Label harus berupa string"),
  errorValidation,
];
