import express from "express";
import {
  getBagan,
  createBagan,
  updateMatchResult,
  deleteAllBaganHandler,
} from "../features/bagan/index.js";
import {
  validateCreateBagan,
  validateUpdateMatchResult,
} from "../features/bagan/bagan.validation.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.post("/", validateCreateBagan, catchAsync(createBagan));
router.get("/", catchAsync(getBagan));
router.put("/:id", validateUpdateMatchResult, catchAsync(updateMatchResult));
// !! Hapus semua bagan
router.delete("/", catchAsync(deleteAllBaganHandler));

export default router;
