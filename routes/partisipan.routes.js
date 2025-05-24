import express from "express";
import { fetchParticipant } from "../features/partisipan/index.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.get("/:id", catchAsync(fetchParticipant));

export default router;
