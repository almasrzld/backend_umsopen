import { participantService } from "./pendaftaran.service.js";
import { reformParticipant } from "../../utils/reform-participant.js";
import {
  MIDTRANS_APP_URL,
  MIDTRANS_SERVER_KEY,
  FRONT_END_URL,
  PENDING_PAYMENT,
  PAID,
  CANCELED,
} from "../../utils/constant.js";
import crypto from "crypto";

export const createTransaction = async (req, res) => {
  const {
    user_name,
    user_email,
    user_phone,
    user_category,
    user_institution,
    user_message,
  } = req.body;

  console.log("--- Debugging req.file in createTransaction ---");
  console.log("req.file:", req.file);
  console.log("--------------------------------------------");

  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "Foto wajib diupload dan harus format JPG, JPEG, dan PNG",
    });
  }

  try {
    const { user_kode, orderId } =
      await participantService.generateUserCodeAndOrderId();

    const gross_amount = 50000;
    const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString(
      "base64"
    );
    const payload = {
      transaction_details: { order_id: orderId, gross_amount },
      customer_details: {
        first_name: user_name,
        email: user_email,
        phone: user_phone,
      },
      callbacks: {
        finish: `${FRONT_END_URL}/pendaftaran/status?order_id=${orderId}`,
        error: `${FRONT_END_URL}/pendaftaran/status?order_id=${orderId}`,
        pending: `${FRONT_END_URL}/pendaftaran/status?order_id=${orderId}`,
      },
    };

    const response = await fetch(`${MIDTRANS_APP_URL}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (response.status !== 201) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create Midtrans transaction",
      });
    }

    const newParticipant = await participantService.createParticipant({
      user_kode,
      orderId,
      user_name,
      user_email,
      user_phone,
      user_category,
      user_institution,
      photo: req.file.path,
      user_message,
      status: PENDING_PAYMENT,
      snap_token: data.token,
      snap_redirect_url: data.redirect_url,
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
  const { page = 1, limit = 10, search = "", status = "ALL" } = req.query;

  try {
    const { data, total } = await participantService.getTransactions({
      page: Number(page),
      limit: Number(limit),
      search,
      status,
    });

    res.json({
      status: "success",
      data: data.map(reformParticipant),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
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
      return res
        .status(404)
        .json({ status: "error", message: "Participant not found" });
    }
    res.json({ status: "success", data: reformParticipant(participant) });
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
    await participantService.updateTransactionStatus({ orderId, status });

    const updated = await participantService.getTransactionById({ orderId });
    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Participant not found after update.",
      });
    }

    res.json({
      status: "success",
      data: reformParticipant(updated),
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

export const trxNotif = async (req, res) => {
  const data = req.body;

  try {
    const participant = await participantService.getTransactionById({
      orderId: data.order_id,
    });
    if (!participant) {
      return res
        .status(404)
        .json({ status: "error", message: "Participant not found" });
    }

    const raw = `${data.order_id}${data.status_code}${data.gross_amount}${MIDTRANS_SERVER_KEY}`;
    const expectedSig = crypto.createHash("sha512").update(raw).digest("hex");
    if (data.signature_key !== expectedSig) {
      console.log("Signature mismatch", {
        expectedSig,
        received: data.signature_key,
      });
      return res
        .status(403)
        .json({ status: "error", message: "Invalid signature key" });
    }

    let newStatus = PENDING_PAYMENT;
    if (
      (data.transaction_status === "capture" &&
        data.fraud_status === "accept") ||
      data.transaction_status === "settlement"
    ) {
      newStatus = PAID;
    } else if (["cancel", "deny", "expire"].includes(data.transaction_status)) {
      newStatus = CANCELED;
    }

    await participantService.updateTransactionStatus({
      orderId: data.order_id,
      status: newStatus,
    });
    const updated = await participantService.getTransactionById({
      orderId: data.order_id,
    });

    res.status(200).json({
      status: "success",
      message: "OK",
      data: reformParticipant(updated),
    });
  } catch (error) {
    console.error("Error in trxNotif:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error in webhook.",
      error: error.message,
    });
  }
};
