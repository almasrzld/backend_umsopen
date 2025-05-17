import { participantService } from "./pendaftaran.service.js";
import { reformParticipant } from "../../utils/reform-participant.js";
import { PENDING_PAYMENT } from "../../utils/constant.js";

export const createTransaction = async (req, res) => {
  const {
    user_name,
    user_email,
    user_phone,
    user_category,
    user_institution,
    user_message,
  } = req.body;

  try {
    const { user_kode, orderId } =
      await participantService.generateUserCodeAndOrderId();

    const gross_amount = 50000;

    const newParticipant = await participantService.createParticipant({
      user_kode,
      orderId,
      user_name,
      user_email,
      user_phone,
      user_category,
      user_institution,
      user_message,
      status: PENDING_PAYMENT,
      snap_token: null,
      snap_redirect_url: null,
    });

    res.status(201).json({
      status: "success",
      message: "Pendaftaran berhasil, menunggu pembayaran.",
      data: reformParticipant(newParticipant),
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error occurred while creating transaction.",
      error: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  const { status } = req.query;

  try {
    const participants = await participantService.getTransactions({ status });
    res.json({
      status: "success",
      data: participants.map((participant) => reformParticipant(participant)),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error occurred while fetching transactions.",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const participant = await participantService.getTransactionById({
      orderId,
    });
    if (!participant) {
      return res.status(404).json({
        status: "error",
        message: "Participant not found",
      });
    }
    res.json({
      status: "success",
      data: reformParticipant(participant),
    });
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error occurred while fetching transaction.",
      error: error.message,
    });
  }
};

export const updateTransactionStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const participant = await participantService.updateTransactionStatus({
      orderId,
      status,
    });
    if (!participant) {
      return res.status(404).json({
        status: "error",
        message: "Participant not found or status update failed.",
      });
    }
    res.json({
      status: "success",
      data: participant,
    });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error occurred while updating status.",
      error: error.message,
    });
  }
};
