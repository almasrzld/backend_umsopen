import express from "express";
import {
  getBagan,
  getBaganByCategory,
  createBagan,
  updateMatchResult,
  resetMatch,
  deleteBaganByCategory,
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
router.get("/:category", catchAsync(getBaganByCategory));
router.patch("/:id", validateUpdateMatchResult, catchAsync(updateMatchResult));
router.patch("/:id/reset", catchAsync(resetMatch));
// !! Hapus bagan berdasarkan kategori
router.delete("/:category", catchAsync(deleteBaganByCategory));
// !! Hapus semua bagan
router.delete("/", catchAsync(deleteAllBaganHandler));

export default router;
