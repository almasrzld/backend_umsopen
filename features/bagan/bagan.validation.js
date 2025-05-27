import { check } from "express-validator";
import { errorValidation } from "../../middlewares/error-validation.js";

// Validasi untuk membuat bagan
export const validateCreateBagan = [
  check("category").notEmpty().withMessage("Kategori wajib diisi"),
  errorValidation,
];

// Validasi untuk update hasil pertandingan
export const validateUpdateMatchResult = [
  check("score1").isNumeric().withMessage("Score1 harus berupa angka"),
  check("score2").isNumeric().withMessage("Score2 harus berupa angka"),
  check("winner").notEmpty().withMessage("Pemenang wajib diisi"),
  check("win_method")
    .notEmpty()
    .isIn(["POINTS", "KO", "WO", "DRAW"])
    .withMessage("Metode kemenangan tidak valid"),
  errorValidation,
];
