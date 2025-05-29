import express from "express";
import {
  getBagan,
  getBaganByCategory,
  createBagan,
  updateMatchResult,
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
// !! Hapus bagan berdasarkan kategori
router.delete("/:category", catchAsync(deleteBaganByCategory));
// !! Hapus semua bagan
router.delete("/", catchAsync(deleteAllBaganHandler));

export default router;
