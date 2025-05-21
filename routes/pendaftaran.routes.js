import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  trxNotif,
} from "../features/pendaftaran/index.js";
import {
  validateParticipant,
  validateParticipantStatus,
} from "../features/pendaftaran/pendaftaran.validation.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.post("/", validateParticipant, catchAsync(createTransaction));
router.get("/", catchAsync(getTransactions));
router.get("/:orderId", catchAsync(getTransactionById));
router.put(
  "/:orderId",
  validateParticipantStatus,
  catchAsync(updateTransactionStatus)
);
router.post("/notification", catchAsync(trxNotif));

export default router;
