import { participantService } from "./partisipan.service.js";
import { reformParticipant } from "../../utils/reform-participant.js";

export const fetchAllParticipants = async (req, res) => {
  const { status = "ALL" } = req.query;

  try {
    const participants =
      status && status !== "ALL"
        ? await participantService.getParticipantsByStatus(status)
        : await participantService.getAllParticipants();

    res.status(200).json({
      status: "success",
      data: participants.map(reformParticipant),
    });
  } catch (error) {
    console.error("Error fetching all participants:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data peserta.",
      error: error.message,
    });
  }
};

export const fetchParticipant = async (req, res) => {
  const { id } = req.params;

  const participant = await participantService.getParticipantById(id);

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
};

export const fetchParticipantsByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({
      status: "error",
      message: "Category is required",
    });
  }

  const participants = await participantService.getParticipantsByCategory(
    category
  );

  res.json({
    status: "success",
    data: participants.map(reformParticipant),
  });
};

export const fetchStatistics = async (req, res) => {
  try {
    const stats = await participantService.getStatistics();

    res.json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch statistics",
    });
  }
};

export const fetchInstitutionStats = async (req, res) => {
  try {
    const data = await participantService.getInstitutionStats();
    res
      .status(200)
      .json({ message: "Berhasil memuat statistik asal institusi", data });
  } catch (err) {
    res.status(500).json({ message: "Gagal memuat data", error: err.message });
  }
};

// !! Hati-hati, fungsi ini akan menghapus semua data peserta
export const deleteAllParticipantsHandler = async (req, res) => {
  try {
    await participantService.deleteAllParticipants();

    res.status(200).json({
      status: "success",
      message: "Semua peserta berhasil dihapus dan counter di-reset.",
    });
  } catch (error) {
    console.error("Error resetting participants:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mereset peserta.",
      error: error.message,
    });
  }
};
