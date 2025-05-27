import express from "express";
import {
  fetchParticipant,
  fetchParticipantsByCategory,
  fetchStatistics,
} from "../features/partisipan/index.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.get("/statistic", catchAsync(fetchStatistics));
router.get("/by-category", catchAsync(fetchParticipantsByCategory));
router.get("/:id", catchAsync(fetchParticipant));

export default router;
