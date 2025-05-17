import { check } from "express-validator";
import { errorValidation } from "../../middlewares/error-validation.js";
import { CANCELED, PAID, PENDING_PAYMENT } from "../../utils/constant.js";

export const validateParticipantStatus = [
  check("status")
    .isIn([PENDING_PAYMENT, PAID, CANCELED])
    .withMessage(`Status must be one of PENDING_PAYMENT, PAID, CANCELED`),
  errorValidation,
];

export const validateParticipant = [
  check("user_name")
    .isLength({ min: 3 })
    .withMessage("Nama harus memiliki setidaknya 3 karakter"),

  check("user_email")
    .isEmail()
    .withMessage("Email harus berupa email yang valid"),

  check("user_phone")
    .isMobilePhone("id-ID") // Assuming Indonesian phone numbers
    .withMessage(
      "Nomor telepon harus berupa nomor telepon Indonesia yang valid"
    ),

  check("user_category")
    .notEmpty()
    .withMessage("Kategori peserta tidak boleh kosong"),

  check("user_institution")
    .notEmpty()
    .withMessage("Institusi peserta tidak boleh kosong"),

  check("user_message")
    .optional()
    .isString()
    .withMessage("Pesan harus berupa string"),

  errorValidation,
];
