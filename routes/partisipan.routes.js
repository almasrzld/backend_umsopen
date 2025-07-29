import express from "express";
import {
  fetchAllParticipants,
  fetchParticipant,
  fetchParticipantsByCategory,
  fetchStatistics,
  fetchInstitutionStats,
  deleteParticipantById,
  deleteAllParticipantsHandler,
} from "../features/partisipan/index.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.get("/", catchAsync(fetchAllParticipants));
router.get("/statistic", catchAsync(fetchStatistics));
router.get("/institution", catchAsync(fetchInstitutionStats));
router.get("/by-category", catchAsync(fetchParticipantsByCategory));
router.get("/:id", catchAsync(fetchParticipant));
// !! HANYA UNTUK ADMIN, sebelum produksi
router.delete("/:id", catchAsync(deleteParticipantById));
router.delete("/delete", catchAsync(deleteAllParticipantsHandler));

export default router;
