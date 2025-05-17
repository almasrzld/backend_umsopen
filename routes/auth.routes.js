import express from "express";
import { register, login, getMe } from "../features/auth/index.js";
import {
  validateRegister,
  validateLogin,
} from "../features/auth/auth.validation.js";
import verifyToken from "../middlewares/auth.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.post("/register", validateRegister, catchAsync(register));
router.post("/login", validateLogin, catchAsync(login));
router.get("/me", verifyToken, catchAsync(getMe));

export default router;
