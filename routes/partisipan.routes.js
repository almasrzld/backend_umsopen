import express from "express";
import {
  fetchParticipant,
  fetchParticipantsByCategory,
  fetchStatistics,
  fetchInstitutionStats,
  deleteAllParticipantsHandler,
} from "../features/partisipan/index.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.get("/statistic", catchAsync(fetchStatistics));
router.get("/institution", catchAsync(fetchInstitutionStats));
router.get("/by-category", catchAsync(fetchParticipantsByCategory));
router.get("/:id", catchAsync(fetchParticipant));
// !! HANYA UNTUK ADMIN, sebelum produksi
router.delete("/delete", catchAsync(deleteAllParticipantsHandler));

export default router;
