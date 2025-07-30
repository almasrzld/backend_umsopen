import express from "express";
import {
  createCategory,
  getCategory,
  getCategoryById,
  deleteCategoryById,
} from "../features/kategori/index.js";
import { validateCreateCategory } from "../features/kategori/kategori.validation.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

// Create category
router.post("/", validateCreateCategory, catchAsync(createCategory));

// Get all categories
router.get("/", catchAsync(getCategory));

// Get category by ID
router.get("/:id", catchAsync(getCategoryById));

// Delete category by ID
router.delete("/:id", catchAsync(deleteCategoryById));

export default router;
